import { ApolloServer } from "apollo-server-express";
// @ts-ignore
import ss from "socket.io-stream";
import Node, { NodeTypes } from "./node";
import BlockChain from "../block-chain";
import publicIp from "public-ip";
import client from "../../apollo-client/client";
import { ADD_NODE, GET_TOP_NODES } from "../../apollo-client/Queries";
import NodeModel from "../mongodb/NodeModel";
import genesisBlock from "../../utils/genesisBlock";
import _ from "lodash";

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
    this.blockChain.createGenesis();
  }

  async start(port = 4000, mongoDbUrl: string) {
    this.startServer(port, mongoDbUrl);

    const externalIp = await publicIp.v4();
    const externalUrl = new URL(`http://${externalIp}:${port}`);

    try {
      try {
        await client.mutate({
          mutation: ADD_NODE,
          variables: {
            nodeInput: {
              address: `${externalUrl.origin}`,
              length: 3,
              type: "FULL_NODE",
            },
          },
        });
      } catch (e) {}

      await NodeModel.findOneAndUpdate(
        {
          address: externalUrl.origin,
        },
        {
          $setOnInsert: {
            address: externalUrl.origin,
            type: "FULL_NODE",
            length: 1,
            lastBlock: genesisBlock.getBlock(),
            lastConnected: Date.now(),
          },
        },
        {
          returnOriginal: false,
          upsert: true,
        },
      ).exec();

      // retrieve top nodes
      interface TopNodes {
        data: {
          topNodes: [
            {
              address: string;
              length: number;
              type: string;
              lastConnected: number;
            },
          ];
        };
      }

      const {
        data: { topNodes },
      }: TopNodes = await client.query({
        query: GET_TOP_NODES,
        variables: {
          type: "FULL_NODE",
        },
      });

      if (topNodes.length) {
        // all things went okay and I got the top nodes
        const allNodesExceptMe = topNodes.filter((node: any) => {
          if (node.address !== externalUrl.origin) return node;
        });

        // for (let node of allNodesExceptMe){
        //   try {
        //     const nodes = await
        //   }catch (e) {
        //
        //   }
        // }
      }

      console.log("successfully connected to the seed node");
    } catch (e) {
      console.log("error", e);
    }
  }
}

export default FullNode;
