import express, { Express } from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import mongoose, { Connection } from "mongoose";
import { BlockInterface } from "../block";
import BlockModel from "../mongodb/BlockModel";

// eslint-disable-next-line no-shadow
enum NodeTypes {
  FULL,
  SMALL,
  MINER,
  WALLET,
  SMALL_WALLET,
}

interface NodeData {
  address: string;
  type: NodeTypes;
  chainLength: number;
  lastBlock: BlockInterface;
}

class Node {
  public readonly type: NodeTypes;

  public readonly app: Express;

  public readonly server: ApolloServer;

  public db: Connection | undefined;

  constructor(type: NodeTypes, typeDefs: any, resolvers: any) {
    this.type = type;
    const app = express();
    this.app = app;

    // apollo graphql server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    this.server = server;
  }

  startServer(port = 4000, mongoDbUrl: string) {
    this.app.use(cors());
    this.app.use(express.json());

    this.connectToMongodb(mongoDbUrl);

    this.app.get("/", (req, res) => {
      res.status(200).json({
        hola: "Hello this is robert kiyosaki here.",
      });
    });

    this.server.applyMiddleware({ app: this.app });

    this.app.listen({ port }, () => {
      console.log(
        `Server ready at http://localhost:${port}${this.server.graphqlPath}`,
      );
    });
  }

  connectToMongodb(url: string) {
    mongoose.connect(
      url,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: true,
      },
      (err) => {
        if (err) console.log(`Error in mongo db ${err}}`);
        else {
          this.db = mongoose.connection;
        }
        console.log("connected to mongodb");
      },
    );
  }
}

export default Node;
export { NodeData, NodeTypes };
