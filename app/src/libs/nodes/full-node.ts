import { ApolloServer, gql } from "apollo-server-express";
// @ts-ignore
import ss from "socket.io-stream";
import Node, { NodeTypes } from "./node";
import BlockChain from "../block-chain";
import publicIp from "public-ip";
import seedNodeClient from "../../apollo-client/seedNodeClient";
import {
  ADD_NODE,
  GET_TOP_NODES,
  PAGINATE_NODES,
} from "../../apollo-client/Queries";
import NodeModel from "../mongodb/NodeModel";
import genesisBlock from "../../utils/genesisBlock";
import _ from "lodash";
import request from "graphql-request";
import { print } from "graphql";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import fetch from "cross-fetch";

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

    const externalIp = "http://localhost"; // await publicIp.v4();
    const externalUrl = new URL(`http://${externalIp}:${port}`);

    try {
      try {
        await seedNodeClient.mutate({
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

      const lastBlock = await this.blockChain.getLastBlock();
      await NodeModel.findOneAndUpdate(
        {
          address: externalUrl.origin,
        },
        {
          $setOnInsert: {
            address: externalUrl.origin,
            type: "FULL_NODE",
            length: 1,
            lastBlock: lastBlock?.getBlock(),
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
      }: TopNodes = await seedNodeClient.query({
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

        console.log("alley", allNodesExceptMe);

        for (let node of allNodesExceptMe) {
          try {
            const bulk = NodeModel.collection.initializeOrderedBulkOp();

            console.log("noder", node.address);

            const client = new ApolloClient({
              link: createHttpLink({
                uri: node.address,
                fetch,
              }),
              cache: new InMemoryCache(),
            });

            const nodes = await client.query({
              query: PAGINATE_NODES,
              variables: {
                paginateInput: {
                  page: 1,
                },
              },
            });

            console.log("nodes", node, nodes);
          } catch (e) {
            console.log("perrorororo", e);
          }
        }
      }

      console.log("successfully connected to the seed node");
    } catch (e) {
      console.log("error", e);
    }
  }
}

export default FullNode;
