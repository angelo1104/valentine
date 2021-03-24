import { gql } from "apollo-server-express";

const typeDefs = gql`
  enum NodeType {
    FULL_NODE
    LIGHT_NODE
    MINER
    WALLET
  }

  type Node {
    address: String!
    type: NodeType!
    length: Int!
    lastBlock: Block!
    lastConnected: Float!
  }

  input NodeInput {
    address: String!
    type: NodeType!
    length: Int!
    lastConnected: Float!
  }

  input ConnectNodeType {
    address: String!
    type: NodeType!
    length: Int!
    lastConnected: Float!
    lastBlock: BlockInput!
  }
`;

export default typeDefs;
