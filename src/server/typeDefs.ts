import { gql } from "apollo-server-express";
import Block from "./Block";
import BlockChain from "./BlockChain";

const typeDefs = gql`
  type Query {
    me: String!
    verifyChain: Boolean!
  }

  type Mutation {
    createBlock(data: JSON!): Block!
  }
`;

export default [typeDefs, Block, BlockChain];
