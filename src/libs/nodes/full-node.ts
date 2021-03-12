import Node, { NodeTypes } from "./node";

class FullNode extends Node {
  start(port = 4000, mongoDbUrl: string) {
    this.startServer(port, mongoDbUrl);
  }
}

export default FullNode;
