import express, { Express } from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import mongoose, { Connection } from "mongoose";
import * as http from "http";
import socket, { Socket } from "socket.io";
import { DocumentNode } from "graphql";

// eslint-disable-next-line no-shadow
enum NodeTypes {
  FULL,
  SMALL,
  MINER,
  WALLET,
  SMALL_WALLET,
}

class Node {
  public readonly type: NodeTypes;

  protected readonly app: Express;

  protected server: ApolloServer;

  protected readonly httpServer: http.Server;

  protected db: Connection | undefined;

  protected readonly io: Socket;

  protected readonly sockets: any[];

  constructor(
    type: NodeTypes,
    typeDefs: DocumentNode | DocumentNode[],
    resolvers: any,
  ) {
    this.type = type;
    this.app = express();
    this.sockets = [];

    // apollo graphql server
    this.server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    this.httpServer = new http.Server(this.app);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.io = socket(this.httpServer);
  }

  startServer(port = 4000, mongoDbUrl: string): void {
    this.app.use(cors());
    this.app.use(express.json());

    this.connectToMongodb(mongoDbUrl);

    this.app.get("/", (req, res) => {
      res.status(200).json({
        hola: "Hello this is robert kiyosaki here.",
      });
    });

    this.server.applyMiddleware({ app: this.app });

    this.httpServer.listen(port, () =>
      console.log(
        `Server ready at http://localhost:${port}${this.server.graphqlPath}`,
      ),
    );

    this.io.on("connection", (nodeSocket: any) => {
      this.sockets.push(nodeSocket);

      nodeSocket.on("disconnect", () => {
        const index = this.sockets.indexOf(nodeSocket);
        this.sockets.splice(index, 1);
      });
    });
  }

  connectToMongodb(url: string): void {
    mongoose.connect(
      url,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
      },
      (err) => {
        if (err) console.log(`Error in mongo db ${err}}`);
        else {
          console.log("connected to mongodb");
          this.db = mongoose.connection;
        }
      },
    );
  }
}

export default Node;
export { NodeTypes };
