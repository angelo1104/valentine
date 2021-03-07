import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    me: String!
  }
`;

export default typeDefs;
