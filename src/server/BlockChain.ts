import { gql } from "apollo-server-express";

const typeDefs = gql`
  type BlockChain {
    chain: [Block]
    length: Int
    valid: Boolean
  }

  type BasicInfo {
    length: Int!
    lastBlock: Block
  }
`;

export default typeDefs;
