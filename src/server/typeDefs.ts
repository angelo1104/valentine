import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    me: String!
  }
`;

export default typeDefs;
