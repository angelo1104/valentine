import Node, { NodeTypes } from "./node";
import BlockChain from "../block-chain";
import { ApolloServer } from "apollo-server-express";

class FullNode extends Node {
  private blockChain: BlockChain;

  constructor(
    public type: NodeTypes,
    private typeDefs: any,
    private resolvers: any,
  ) {
    super(type, typeDefs, resolvers);

    this.blockChain = new BlockChain();
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({
        blockChain: this.blockChain,
      }),
    });

    this.server = server;
  }

  start(port = 4000, mongoDbUrl: string) {
    this.startServer(port, mongoDbUrl);
  }
}

export default FullNode;
