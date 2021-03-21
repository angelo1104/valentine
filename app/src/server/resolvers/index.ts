import GraphQLJSON from "graphql-type-json";
import lodash from "lodash";
import BlockChain from "../../libs/block-chain";
import fullNodeResolvers from "./full-node-resolvers";

interface Context {
  blockChain: BlockChain;
}

const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    me() {
      return "Hola";
    },
  },
};

export default lodash.merge(resolvers, fullNodeResolvers);

export type { Context };
