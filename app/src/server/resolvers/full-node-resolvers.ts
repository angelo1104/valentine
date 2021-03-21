import lodash from "lodash";
import getLengthOfCollection from "../../utils/getLengthOfCollection";
import NodeModel from "../../libs/mongodb/NodeModel";
import BlockModel from "../../libs/mongodb/BlockModel";
import blockChainResolvers from "./blockchain-resolvers";

const resolvers = {
  Query: {
    nodesLength: async (): Promise<number> => getLengthOfCollection(NodeModel),
    chainLength: async (): Promise<number> => getLengthOfCollection(BlockModel),
  },
};

export default lodash.merge(resolvers, blockChainResolvers);
