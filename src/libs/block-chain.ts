import { Block, BlockInterface } from "./block";
import range from "../utils/range";
import BlockModel from "./mongodb/BlockModel";
import hash from "../utils/hash";
import getBlockFromDoc from "../utils/getBlockFromDoc";

type BlockLoopCallback = (block: Block) => boolean;

class BlockChain {
  async createGenesis(data: any) {
    try {
      // check if the chain contains genesis
      const lastBlock = await this.getLastBlock();
      if (!lastBlock) {
        const genesisBlock = new Block({
          timestamp: new Date().getTime(),
          prevHash: range(64)
            .map(() => "0")
            .join(""),
          nonce: 0,
          index: 1,
          data,
          difficulty: 1,
        });

        this.addBlock(genesisBlock, true);
      } else {
        console.log("Genesis exists");
      }
    } catch (e) {
      console.log(e);
    }
  }

  // eslint-disable-next-line class-methods-use-this,consistent-return
  async addBlock(block: Block, mine = false): Promise<Block> {
    // check the blocks legibility
    if (block.verifyBlock()) {
      // add block
      const newBlock = new BlockModel({
        ...block.getBlock(),
      });

      try {
        const doc = await newBlock.save();
        // eslint-disable-next-line no-underscore-dangle
        // eslint-disable-next-line no-underscore-dangle
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

  // eslint-disable-next-line consistent-return
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

        const newBlock = await this.addBlock(block, mine);
        return newBlock;
      }
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

  async verifyChain(): Promise<boolean> {
    let lastBlock: Block | null = null;

    // eslint-disable-next-line consistent-return
    try {
      let valid = true;

      await this.loopThroughChain((block) => {
        // last block is not null
        if (lastBlock) {
          // check if block is mined
          if (!block.verifyBlock()) {
            console.log("block is not mined", block, hash(block.getBlock()));
            valid = false;
          }

          // check if the previous hash is valid
          if (hash(lastBlock.getBlock()) !== block.getBlock().prevHash) {
            console.log(
              "previous hash is not valid",
              lastBlock,
              hash(lastBlock.getBlock()),
              block,
            );
            valid = false;
          }

          // check if index is valid
          if (lastBlock.getBlock().index + 1 !== block.getBlock().index) {
            console.log("index is not valid", lastBlock, block);
            valid = false;
          }
        }

        lastBlock = block;
        return valid;
      });

      return valid;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async loopThroughChain(callBack: BlockLoopCallback) {
    // create cursor see on mongoose docs
    const cursor = BlockModel.find().cursor();
    let i = 0;

    for (
      let doc = await cursor.next();
      doc != null;
      // eslint-disable-next-line no-await-in-loop
      doc = await cursor.next()
    ) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const valid = await callBack(getBlockFromDoc(doc));

        if (!valid) {
          break;
        }

        i += 1;
      } catch (e) {
        throw new Error(e.message);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getLengthOfChain() {
    try {
      const count = await BlockModel.countDocuments().exec();
      return count;
    } catch (e) {
      throw new Error(e.message);
    }
  }
}

export default BlockChain;
