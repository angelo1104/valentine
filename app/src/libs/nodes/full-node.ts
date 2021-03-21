import { ApolloServer } from "apollo-server-express";
// @ts-ignore
import ss from "socket.io-stream";
import Node, { NodeTypes } from "./node";
import BlockChain from "../block-chain";
import publicIp from "public-ip";
import seedNodeClient from "../../apollo-client/seedNodeClient";
import { ADD_NODE, GET_TOP_NODES } from "../../apollo-client/Queries";
import NodeModel from "../mongodb/NodeModel";
import router from "../../server/routes/nodes";
import axios from "axios";

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
        ...req,
        blockChain: this.blockChain,
      }),
    });

    this.server = server;
    this.blockChain.createGenesis();

    this.app.use("/nodes", router);
  }

  async start(port = 4000, mongoDbUrl: string) {
    this.startServer(port, mongoDbUrl);

    this.syncUp(port);
  }

  async syncUp(port = 4000) {
    try {
      // use localhost in development because it caused ip address issues in syncing up with nodes
      const externalIp =
        process.env.NODE_PRODUCTION == "true"
          ? await publicIp.v4()
          : "localhost";
      const externalUrl = new URL(`http://${externalIp}:${port}`);

      await this.connectToSeedNode(externalUrl);
      await this.setupNodes(externalUrl);
      // for debugging purposes
      console.log("successfully connected to the seed node");
    } catch (e) {
      console.error("error", e);
    }
  }

  async connectToSeedNode(externalUrl: URL) {
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
      throw e;
    }
  }

  async setupNodes(externalUrl: URL) {
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
        const allNodesExceptMe = topNodes.filter((node: any) => {
          if (node.address !== externalUrl.origin) return node;
        });

        // loop through using for of loop because for of allows breaking up.

        // initialize ordered bulk for fast read and write ops
        const bulk = NodeModel.collection.initializeOrderedBulkOp();

        for (let node of allNodesExceptMe) {
          try {
            console.info(`noder ${node.address}`);

            const {
              data: { nodes },
            } = await axios.get(`${node.address}/nodes`);

            console.log("nodes", nodes);
            break;
          } catch (e) {
            console.error("error while working on with nodes", e);
            continue;
          }
        }
      }
    } catch (e) {
      console.error("perror", e);
    }
  }
}

export default FullNode;
