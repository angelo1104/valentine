import { ApolloServer, gql } from "apollo-server-micro";
import mongoose, { Schema } from "mongoose";
import { GraphQLJSONObject } from "graphql-type-json";

mongoose
  .connect(process.env.MONGODB_URL, {
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to mongo db"))
  .catch((err) => console.log(`Error in mongo db ${err}`));

// TODO: replace schema

const NodeSchema = new mongoose.Schema({
  address: {
    required: true,
    type: String,
  },
  length: {
    required: true,
    type: Number,
  },
  type: {
    required: true,
    type: String
  }
});

const Node = mongoose.models.Nodes || mongoose.model("Nodes", NodeSchema);

const typeDefs = gql`
  scalar JSON

  enum NodeType {
    FULL_NODE
    LIGHT_NODE
    MINER
    WALLET
  }
  
  type Query {
    me: String!
  }

  type Block {
    index: Int!
    data: JSON!
    nonce: Int!
    timestamp: Float!
    prevHash: String!
    difficulty: Int!
  }

  input BlockInput {
    index: Int!
    data: JSON!
    nonce: Int!
    timestamp: Float!
    prevHash: String!
    difficulty: Int!
  }

  input NodeInput {
    address: String!
    length: Int!
    type: NodeType!
  }

  type Node {
    address: String!
    length: Int!
    type: NodeType!
  }

  input RemoveNodeInput {
    address: String!
  }

  type Mutation {
    addNode(input: NodeInput!): Node!
    removeNode(input: RemoveNodeInput!): Node!
  }
`;

const resolvers = {
  JSON: GraphQLJSONObject,
  Query: {
    me: () => "Hello hello hello seed node kiyosaki here.",
  },
  Mutation: {
    addNode: async (_, { input: { address, length, type } }) => {
      const node = new Node({
        address,
        length,
        type,
      });

      const nodeDoc = await node.save();

      return {
        address: nodeDoc?.address,
        length: nodeDoc?.length,
        type: nodeDoc?.type,
      };
    },
    removeNode: async (_, { input: { address } }) => {
      const removed = await Node.findOneAndDelete({ address }).exec();

      if (!removed) throw new Error("No such node found with such address.");

      return {
        address: removed?.address,
        length: removed?.length,
        type: removed?.type,
      };
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

export default apolloServer.createHandler({ path: "/api/graphql" });

export const config = {
  api: {
    bodyParser: false,
  },
};
