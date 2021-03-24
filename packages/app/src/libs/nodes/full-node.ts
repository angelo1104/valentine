import { ApolloServer } from "apollo-server-express";
import publicIp from "public-ip";
import axios from "axios";
import { DocumentNode } from "graphql";
import mongoose from "mongoose";
import Node, { NodeTypes } from "./node";
import BlockChain from "../block-chain";
import seedNodeClient from "../../apollo-client/seedNodeClient";
import { ADD_NODE, GET_TOP_NODES } from "../../apollo-client/Queries";
import NodeModel from "../mongodb/NodeModel";
import router from "../../server/routes/nodes";
import listenNodes from "../db-listeners/nodes";

interface NodeInterface {
  address: string;
  length: number;
  type: string;
  lastConnected: number;
}

interface TopNodes {
  data: {
    topNodes: NodeInterface[];
  };
}

class FullNode extends Node {
  private readonly blockChain: BlockChain;

  constructor(
    public type: NodeTypes,
    private typeDefs: DocumentNode | DocumentNode[],
    private resolvers: any,
  ) {
    super(type, typeDefs, resolvers);

    this.blockChain = new BlockChain();
    this.server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({
        ...req,
        blockChain: this.blockChain,
      }),
    });
    this.blockChain.createGenesis();

    this.app.use("/nodes", router);
  }

  async start(port = 4000, mongoDbUrl: string): Promise<void> {
    this.startServer(port, mongoDbUrl);

    // listen for changes in the mongoose db for nodes collection
    listenNodes();

    await this.syncUp(port);
  }

  async syncUp(port = 4000): Promise<void> {
    try {
      // use localhost in development because it caused ip address issues in syncing up with nodes
      const externalIp =
        // eslint-disable-next-line eqeqeq
        process.env.NODE_PRODUCTION == "true"
          ? await publicIp.v4()
          : "localhost";
      const externalUrl = new URL(`http://${externalIp}:${port}`);

      await this.connectToSeedNode(externalUrl);
      await this.setupNodes(externalUrl);

      // for debugging purposes
      console.log("successfully connected to the seed node");
    } catch (e) {
      // console.error("error", e);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async connectToSeedNode(externalUrl: URL): Promise<void> {
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
    } catch (e) {
      // TODO: REMOVE THIS THROW IT IS ONLY FOR DEBUGGING PURPOSES
      throw new Error(e.message);
    }
  }

  async setupNodes(externalUrl: URL): Promise<void> {
    try {
      const lastBlock = await this.blockChain.getLastBlock();

      // find the node of my address and update it properly.
      await NodeModel.findOneAndUpdate(
        {
          address: externalUrl.origin,
        },
        {
          address: externalUrl.origin,
          type: "FULL_NODE",
          length: 1,
          lastBlock: lastBlock?.getBlock(),
          lastConnected: Date.now(),
        },
        {
          upsert: true,
        },
      ).exec();

      // get the list of to nodes from seed node
      const {
        data: { topNodes },
      }: TopNodes = await seedNodeClient.query({
        query: GET_TOP_NODES,
        variables: {
          type: "FULL_NODE",
        },
      });

      if (topNodes.length) {
        // top nodes is valid and its length is not equal to zero
        const filterNodesForMe = (nodes: NodeInterface[]) => {
          // eslint-disable-next-line array-callback-return,consistent-return
          return nodes.filter((node) => {
            if (node.address !== externalUrl.origin) return node;
          });
        };

        const allNodesExceptMe = filterNodesForMe(topNodes);

        // initialize ordered bulk for fast read and write ops
        const bulk = NodeModel.collection.initializeOrderedBulkOp();

        // delete all the nodes except me from the nodes db
        bulk
          .find({
            address: { $ne: externalUrl.origin },
          })
          .delete();

        // loop through using for of loop because for of allows breaking up.
        // eslint-disable-next-line no-restricted-syntax
        for (const node of allNodesExceptMe) {
          try {
            console.info(`noder ${node.address}`);

            // eslint-disable-next-line no-await-in-loop
            const { data } = await axios.get(`${node.address}/basic-info`);

            bulk.insert({
              ...node,
              length: data?.length,
              lastBlock: data?.lastBlock,
              lastConnected: Date.now(),
            });
          } catch (e) {
            // console.error("error while working on with nodes", e);
          }
        }
      }
    } catch (e) {
      // console.error("perror", e);
    }
  }
}

export default FullNode;
