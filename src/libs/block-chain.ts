import { Block } from "./block";
import range from "../utils/range";
import BlockModel from "./mongodb/BlockModel";

class BlockChain {
  async createGenesis(data: any) {
    try {
      const lastBlock = await this.getLastBlock();
      if (!lastBlock.length) {
        const genesisBlock = new Block(
          {
            timestamp: new Date().getTime(),
            prevHash: range(64)
              .map(() => "0")
              .join(""),
            nonce: 0,
            index: 1,
            data,
          },
          1,
        );

        this.addBlock(genesisBlock, true);
      } else console.log("It exists", lastBlock);
    } catch (e) {
      console.log(e);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  addBlock(block: Block, mine = false) {
    // check the blocks legibility
    if (block.verifyBlock()) {
      // add block
      const newBlock = new BlockModel({
        ...block.getBlock(),
      });

      newBlock.save((error: any, doc: any) => {
        if (error) throw new Error(error.message);
        else console.log(doc);
      });
    } else if (mine) {
      block.mine();

      if (block.verifyBlock()) {
        // add block
        const newBlock = new BlockModel({
          ...block.getBlock(),
        });

        newBlock.save((error: any, doc: any) => {
          if (error) throw new Error(error.message);
          else console.log(doc);
        });
      } else {
        throw new Error("Block is invalid");
      }
    } else {
      throw new Error("Block is invalid");
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getLastBlock() {
    try {
      const block = await BlockModel.find({})
        .sort({ timestamp: "ascending" })
        .limit(1)
        .exec();
      return block;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default BlockChain;
