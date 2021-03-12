import { Block, BlockInterface } from "./block";
import range from "../utils/range";
import BlockModel from "./mongodb/BlockModel";
import hash from "../utils/hash";

type BlockLoopCallback = (block: BlockInterface) => void;

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
  async addBlock(block: Block, mine = false) {
    // check the blocks legibility
    if (block.verifyBlock()) {
      // add block
      const newBlock = new BlockModel({
        ...block.getBlock(),
      });

      newBlock.save((error: any, doc: any) => {
        if (error) throw new Error(error.message);
        else return doc;
      });
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
          return doc;
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

  async createBlock(data: any, mine = true) {
    try {
      const lastBlock: BlockInterface = await this.getLastBlock();

      const block = new Block({
        index: lastBlock.index + 1,
        prevHash: hash(lastBlock),
        nonce: 0,
        data,
        timestamp: new Date().getTime(),
        difficulty: 1,
      });

      const newBlock = this.addBlock(block, mine);

      return newBlock;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getLastBlock() {
    try {
      // get last block by timestamp
      const block = await BlockModel.find({})
        .sort({ timestamp: "ascending" })
        .limit(1)
        .exec();
      return block[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  verifyChain() {
    let lastBlock: Block | null = null;

    // eslint-disable-next-line consistent-return
    this.loopThroughChain((block) => {
      const newBlock = new Block(block);
      // last block is not null
      if (lastBlock) {
        // check if block is mined
        if (!newBlock.verifyBlock()) return false;

        // check if the previous hash is valid
        if (hash(lastBlock.getBlockData()) !== newBlock.getBlock().prevHash)
          return false;

        // check if index is valid
        if (lastBlock.getBlock().index + 1 !== newBlock.getBlock().index)
          return false;
      }

      lastBlock = newBlock;
    }).then(() => {
      return true;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async loopThroughChain(callBack: BlockLoopCallback) {
    // create cursor see on mongoose docs
    const cursor = BlockModel.find().cursor();

    for (
      let doc = await cursor.next();
      doc != null;
      // eslint-disable-next-line no-await-in-loop
      doc = await cursor.next()
    ) {
      try {
        callBack(doc);
      } catch (e) {
        console.log("error", e);
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
