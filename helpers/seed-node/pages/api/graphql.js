import { ApolloServer, gql } from "apollo-server-micro";
import mongoose, { Schema } from "mongoose";
import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";

mongoose
  .connect(process.env.MONGODB_URL, {
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to mongo db"))
  .catch((err) => console.log(`Error in mongo db ${err}`));

const NodeSchema = new mongoose.Schema({
  address: {
    required: true,
    type: String,
  },
  length: {
    required: true,
    type: Number,
  },
  lastBlock: {
    index: {
      required: true,
      type: Number,
    },
    data: {
      required: true,
      type: Schema.Types.Mixed,
    },
    nonce: {
      required: true,
      type: Number,
    },
    timestamp: {
      required: true,
      type: Number,
    },
    prevHash: {
      required: true,
      type: String,
    },
    difficulty: {
      required: true,
      type: Number,
    },
  },
});

const Node = mongoose.models.Nodes || mongoose.model("Nodes", NodeSchema);

const typeDefs = gql`
  scalar JSON

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
    lastBlock: BlockInput!
  }

  type Node {
    address: String!
    length: Int!
    lastBlock: Block!
  }

  type Mutation {
    addNode(input: NodeInput!): Node!
  }
`;

const resolvers = {
  JSON: GraphQLJSONObject,
  Query: {
    me: () => "Hello hello hello seed node kiyosaki here.",
  },
  Mutation: {
    addNode: async (_, { input: { address, length, lastBlock } }) => {
      const node = new Node({
        address,
        length,
        lastBlock,
      });

      const nodeDoc = await node.save();

      console.log(nodeDoc);
      return {
        address: nodeDoc?.address,
        length: nodeDoc?.length,
        lastBlock: nodeDoc?.lastBlock,
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
