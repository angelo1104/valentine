import { gql } from "apollo-server-express";
import Block from "./Block";
import BlockChain from "./BlockChain";
import Nodes from "./Nodes";

const typeDefs = gql`
  type Query {
    me: String!
    verifyChain: Boolean!
    basicInfo: BasicInfo!
    paginateChain(input: PaginateInput!): PaginateChain!
    nodesLength: Int!
    chainLength: Int!
  }

  type Mutation {
    createBlock(data: JSON!): Block!
  }
`;

export default [typeDefs, Block, BlockChain, Nodes];
