import FullNode from "./libs/nodes/full-node";
import { NodeTypes } from "./libs/nodes/node";
import typeDefs from "./server/typeDefs";
import resolvers from "./server/resolvers";

const fullNode = new FullNode(NodeTypes.FULL, typeDefs, resolvers);

export default fullNode;
