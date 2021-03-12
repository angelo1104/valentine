import GraphQLJSON from "graphql-type-json";
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
  Mutation: {
    async createBlock(_: any, { data }: any, { blockChain }: Context) {
      try {
        const doc = await blockChain.createBlock(data);

        return doc;
      } catch (e) {
        throw new Error(e.message);
      }
    },
  },
};

export default resolvers;
