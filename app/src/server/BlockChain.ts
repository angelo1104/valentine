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

  input PaginateInput {
    page: Int!
  }

  type PaginateChain {
    chain: [Block]!
    length: Int!
    page: Int!
    next: Boolean!
  }
`;

export default typeDefs;
