import { Context } from "./index";
import paginate from "../../utils/paginate";
import { NUMBER_PER_PAGE_PAGINATION } from "../../constants/constants";
import BlockModel from "../../libs/mongodb/BlockModel";
import { BlockInterface } from "../../libs/block";
import { BasicInfo } from "../../libs/block-chain";

interface PaginateChain {
  chain: BlockInterface[];
  length: number;
  page: number;
  next: boolean;
}

const resolvers = {
  Queries: {
    verifyChain: async (
      _: any,
      __: any,
      { blockChain }: Context,
    ): Promise<boolean> => blockChain.verifyChain(),
    basicInfoOfChain: async (
      _: any,
      __: any,
      { blockChain }: Context,
    ): Promise<BasicInfo> => blockChain.getBasicInfo(),
    paginateChain: async (
      _: any,
      { input: { page } }: any,
      { blockChain }: Context,
    ): Promise<PaginateChain> => {
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
  },
  Mutation: {
    createBlock: async (
      _: any,
      { data }: any,
      { blockChain }: Context,
    ): Promise<BlockInterface> => {
      const block = await blockChain.createBlock(data, true);
      return block.getBlock();
    },
  },
};

export default resolvers;
