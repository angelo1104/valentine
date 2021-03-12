import dotenv from "dotenv";
import mongoose from "mongoose";
import sizeof from "object-sizeof";
import { Block } from "./libs/block";
import hash from "./utils/hash";
import { NodeTypes } from "./libs/nodes/node";
import typeDefs from "./server/typeDefs";
import resolvers from "./server/resolvers";
import FullNode from "./libs/nodes/full-node";
import BlockChain from "./libs/block-chain";

// initialize environment variables
dotenv.config();

// start server on port 4000
const port = process.env.PORT || "4000";
const node = new FullNode(NodeTypes.FULL, typeDefs, resolvers);

node.startServer(parseInt(port, 10), process.env.MONGODB_URL || "");

const blockChain = new BlockChain();
blockChain.createGenesis({
  transactions: [
    {
      payer: "block chain",
      receiver: "angelo",
      amount: 200000,
    },
  ],
});
