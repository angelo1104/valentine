import GraphQLJSON from "graphql-type-json";
import lodash from "lodash";
import blockChainResolvers from "./FullChainResolvers";
import BlockChain from "../libs/block-chain";

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

export default lodash.merge(resolvers, blockChainResolvers);

export type { Context };
