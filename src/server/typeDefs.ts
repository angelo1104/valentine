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

  type Query {
    me: String!
    verifyChain: Boolean!
  }

  type Mutation {
    createBlock(data: JSON!): Block!
  }
`;

export default typeDefs;
