import { gql } from "apollo-server-express";
import Block from "./block-types";
import BlockChain from "./blockchain-types";
import Nodes from "./node-types";

const typeDefs = gql`
  type Query {
    me: String!
    verifyChain: Boolean!
    basicInfoOfChain: BasicInfoOfChain!
    paginateChain(input: PaginateInput!): PaginateChain!
    nodesLength: Int!
    chainLength: Int!
  }

  type Mutation {
    createBlock(data: JSON!): Block!
  }
`;

export default [typeDefs, Block, BlockChain, Nodes];
