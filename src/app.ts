import dotenv from "dotenv";
import mongoose from "mongoose";
import sizeof from "object-sizeof";
import { Block } from "./libs/block";
import hash from "./utils/hash";
import { NodeTypes } from "./libs/nodes/node";
import typeDefs from "./server/typeDefs";
import resolvers from "./server/resolvers";
import FullNode from "./libs/nodes/full-node";
import MerkleTree from "./utils/merkleTree";

// initialize environment variables
dotenv.config();

mongoose.connect(
  process.env.MONGODB_URL || "",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true,
  },
  (err) => console.log(`Error in mongo db ${err}`),
);

const block = new Block(
  {
    data: "hola",
    hash: "ho",
    index: 2,
    nonce: 3,
    prevHash: "4",
    timestamp: 5,
  },
  4,
);

console.log(block.mine(), hash(JSON.parse(block.getBlock())));

// start server on port 4000
const port = process.env.PORT || "4000";
const node = new FullNode(NodeTypes.FULL, typeDefs, resolvers);

node.startServer(parseInt(port, 10), process.env.MONGODB_URL || "");

const arr = ["hola", "mola", "dola", "rola", "cura", "mure"];

const root = MerkleTree.generateMerkleTree(arr);

console.log("verify", MerkleTree.verifyRoot(root, [...arr]));
