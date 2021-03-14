import dotenv from "dotenv";
import { NodeTypes } from "./libs/nodes/node";
import typeDefs from "./server/typeDefs";
import resolvers from "./server/resolvers";
import FullNode from "./libs/nodes/full-node";

// initialize environment variables
dotenv.config();

// start server on port 4000
const port = process.env.PORT || "4000";
const node = new FullNode(NodeTypes.FULL, typeDefs, resolvers);

node.start(parseInt(port, 10), process.env.MONGODB_URL || "");
