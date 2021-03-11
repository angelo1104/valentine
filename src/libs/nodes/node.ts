import express, { Express } from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { BlockInterface } from "../block";

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

  private readonly app: Express;

  private readonly server: ApolloServer;

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

  startServer(port = 4000) {
    this.app.use(cors());
    this.app.use(express.json());

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
}

export default Node;
export { NodeData, NodeTypes };
