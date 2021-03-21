import lodash from "lodash";
import getLengthOfCollection from "../../utils/getLengthOfCollection";
import NodeModel from "../../libs/mongodb/NodeModel";
import BlockModel from "../../libs/mongodb/BlockModel";
import blockChainResolvers from "./blockchain-resolvers";
import paginate from "../../utils/paginate";
import { NUMBER_PER_NODES_PAGINATION } from "../../constants/constants";

const resolvers = {
  Query: {
    nodesLength: async (): Promise<number> => getLengthOfCollection(NodeModel),
    chainLength: async (): Promise<number> => getLengthOfCollection(BlockModel),
    paginateNodes: async (_: any, { input: { page } }: any) =>
      paginate(NUMBER_PER_NODES_PAGINATION, page, NodeModel),
  },
};

export default lodash.merge(resolvers, blockChainResolvers);
