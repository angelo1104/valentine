import { ApolloServer } from "apollo-server-express";
// @ts-ignore
import ss from "socket.io-stream";
import Node, { NodeTypes } from "./node";
import BlockChain from "../block-chain";
import publicIp from "public-ip";
import client from "../../apollo-client/client";
import { ADD_NODE } from "../../apollo-client/Queries";

class FullNode extends Node {
  private readonly blockChain: BlockChain;

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
    this.blockChain.createGenesis({
      hola: "robert kiyosaki",
    });
  }

  async start(port = 4000, mongoDbUrl: string) {
    this.startServer(port, mongoDbUrl);

    const externalIp = await publicIp.v4();
    const externalUrl = new URL(`http://${externalIp}:${port}`);

    try {
      const result = await client.mutate({
        mutation: ADD_NODE,
        variables: {
          nodeInput: {
            address: `${externalUrl.origin}`,
            length: 3,
            type: "FULL_NODE",
          },
        },
      });

      console.log("successfully connected to the seed node");
    } catch (e) {
      console.log("error", e);
    }
  }
}

export default FullNode;
