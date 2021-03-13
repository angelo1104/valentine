import { Context } from "./resolvers";

const resolvers = {
  Query: {
    async verifyChain(_: any, __: any, { blockChain }: Context) {
      const valid = await blockChain.verifyChain();
      return valid;
    },
  },
  Mutation: {
    async createBlock(_: any, { data }: any, { blockChain }: Context) {
      try {
        const doc = await blockChain.createBlock(data);
        return doc?.getBlock();
      } catch (e) {
        throw new Error(e.message);
      }
    },
  },
};

export default resolvers;
