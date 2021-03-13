import { gql } from "apollo-server-express";

const typeDefs = gql`
  type BlockChain {
    chain: [Block]
    length: Int
    valid: Boolean
  }
`;

export default typeDefs;
