import { Block, BlockInterface } from "./block";
import BlockModel from "./mongodb/BlockModel";
import hash from "../utils/hash";
import getBlockFromDoc from "../utils/getBlockFromDoc";
import loopThroughEachDoc from "../utils/loopThroughEachDoc";
import getLengthOfChain from "../utils/getLengthOfCollection";
import genesisBlock from "../utils/genesisBlock";

interface BasicInfo {
  length: number;
  lastBlock: BlockInterface | undefined;
}

class BlockChain {
  async createGenesis(): Promise<void> {
    try {
      // check if the chain contains genesis
      const lastBlock = await this.getLastBlock();
      if (!lastBlock) {
        await this.addBlock(genesisBlock, true);
        console.log("Created genesis block.");
      } else {
        console.log("Genesis exists");
      }
    } catch (e) {
      console.log(e);
    }
  }

  // eslint-disable-next-line class-methods-use-this,consistent-return
  async addBlock(block: Block, mine = false): Promise<Block> {
    const lastBlock = await this.getLastBlock();

    // check the blocks legibility
    if (block.verifyBlock(lastBlock?.getBlock())) {
      // add block
      const newBlock = new BlockModel({
        ...block.getBlock(),
      });

      try {
        const doc = await newBlock.save();
        return getBlockFromDoc(doc);
      } catch (e) {
        throw new Error(e.message);
      }
    } else if (mine) {
      // mine the block
      block.mine();

      if (block.verifyBlock()) {
        // add block
        const newBlock = new BlockModel({
          ...block.getBlock(),
        });

        try {
          const doc = await newBlock.save();
          return getBlockFromDoc(doc);
        } catch (e) {
          throw new Error(e.message);
        }
      } else {
        throw new Error("Block is invalid");
      }
    } else {
      throw new Error("Block is invalid");
    }
  }

  async createBlock(data: any, mine = true): Promise<Block | undefined> {
    try {
      const lastBlock: Block | null = await this.getLastBlock();

      if (lastBlock) {
        const block = new Block({
          index: lastBlock?.getBlock().index + 1,
          prevHash: hash(lastBlock.getBlock()),
          nonce: 0,
          data,
          timestamp: new Date().getTime(),
          difficulty: 1,
        });

        return await this.addBlock(block, mine);
      }

      throw new Error(
        "Last block is undefined there is a problem with the chain.",
      );
    } catch (e) {
      throw new Error(e.message);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getLastBlock(): Promise<Block | null> {
    try {
      // get last block by timestamp
      const block = await BlockModel.find({})
        .sort({ timestamp: "descending" })
        .limit(1)
        .exec();

      if (block.length) {
        return getBlockFromDoc(block[0]);
      }
      return null;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async verifyChain(): Promise<boolean> {
    let lastBlock: Block | null = null;

    // eslint-disable-next-line consistent-return
    try {
      let valid = true;

      await loopThroughEachDoc(BlockModel, (block) => {
        valid = block.verifyBlock(lastBlock?.getBlock());
        lastBlock = block;

        // do break should be false if valid is ture and should be true if the chain is not valid
        return !valid;
      });

      return valid;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async getBasicInfo(): Promise<BasicInfo> {
    const lengthOfChain = await getLengthOfChain(BlockModel);
    const lastBlock = await this.getLastBlock();

    return {
      length: lengthOfChain,
      lastBlock: lastBlock?.getBlock(),
    };
  }
}

export default BlockChain;
