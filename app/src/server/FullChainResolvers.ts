import { Context } from "./resolvers";
import paginate from "../utils/paginate";
import BlockModel from "../libs/mongodb/BlockModel";
import { NUMBER_PER_PAGE_PAGINATION } from "../constants/constants";
import NodeModel from "../libs/mongodb/NodeModel";
import getLengthOfCollection from "../utils/getLengthOfCollection";

const resolvers = {
  Query: {
    async verifyChain(_: any, __: any, { blockChain }: Context) {
      const valid = await blockChain.verifyChain();
      return valid;
    },
    async basicInfo(_: any, __: any, { blockChain }: Context) {
      const basicInfo = await blockChain.getBasicInfo();
      return basicInfo;
    },
    async paginateChain(
      _: any,
      { input: { page } }: any,
      { blockChain }: Context,
    ) {
      const getInfo = await Promise.all([
        paginate(NUMBER_PER_PAGE_PAGINATION, page, BlockModel),
        blockChain.getBasicInfo(),
      ]);
      return {
        chain: getInfo[0],
        length: getInfo[1].length,
        page,
        next: getInfo[1].length - page * NUMBER_PER_PAGE_PAGINATION > 0,
      };
    },
    paginateNodes: async (_: any, { input: { page } }: any) => {
      const getNodes = await paginate(
        NUMBER_PER_PAGE_PAGINATION,
        page,
        NodeModel,
      );
      return getNodes;
    },
    nodesLength: async () => await getLengthOfCollection(NodeModel),
    chainLength: async () => await getLengthOfCollection(BlockModel),
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
