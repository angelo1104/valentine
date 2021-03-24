import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar JSON

  type Block {
    index: Int!
    nonce: Float!
    timestamp: Float!
    data: JSON!
    prevHash: String!
    difficulty: Int!
  }

  input BlockInput {
    index: Int!
    nonce: Float!
    timestamp: Float!
    data: JSON!
    prevHash: String!
    difficulty: Int!
  }
`;

export default typeDefs;
