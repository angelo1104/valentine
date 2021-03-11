import Node, { NodeTypes } from "./node";

class FullNode extends Node {
  // constructor(type: NodeTypes, typeDefs: any, resolvers: any) {
  //   super(type, typeDefs, resolvers);
  // }

  start(port = 4000, mongoDbUrl: string) {
    this.startServer(port, mongoDbUrl);
    this.getChainFromDb();
  }
}

export default FullNode;
