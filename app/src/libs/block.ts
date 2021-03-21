import sizeof from "object-sizeof";
import getTime from "../utils/getTime";
import proofOfWork from "../utils/proofOfWork";
import hash from "../utils/hash";

interface BlockInterface {
  index: number;
  data: any;
  nonce: number;
  timestamp: number;
  prevHash: string;
  difficulty: number;
}

class Block {
  private block: BlockInterface;

  public readonly maxNonce: number;

  constructor(block: BlockInterface) {
    this.block = block;
    this.maxNonce = 4000000000;
  }

  getBlock(): BlockInterface {
    return this.block;
  }

  mine(): BlockInterface {
    console.log("mining..mine the mine");
    let previousTime = getTime();
    let mined = false;

    while (!mined) {
      for (let nonce = 0; nonce <= this.maxNonce; nonce += 1) {
        const currentTime = getTime();

        // time changed
        if (currentTime !== previousTime) {
          // reset the nonce
          nonce = 0;
          previousTime = currentTime;
        } else {
          // we are in the same second. NO MILLISECONDS

          const block = {
            ...this.block,
            nonce,
            timestamp: currentTime,
          };

          if (proofOfWork(block, block.difficulty)) {
            // set the block
            this.block = block;
            // break the while loop
            mined = true;
            break;
          }
        }
      }

      mined = true;
    }

    return this.block;
  }

  verifyBlock(lastBlock?: BlockInterface | undefined): boolean {
    const verifyIndividualBlock = (): boolean => {
      if (!proofOfWork(this.block, this.block.difficulty)) return false;

      if (this.block.nonce > this.maxNonce || this.block.nonce < 0)
        return false;

      // if size of block is more than 1mb or 1 million bytes
      return sizeof(this.block) <= 1000000;
    };

    if (lastBlock) {
      // there is last block
      if (lastBlock.index + 1 !== this.block.index) return false;

      if (hash(lastBlock) !== this.block.prevHash) return false;
    }

    return verifyIndividualBlock();
  }
}

export { Block };
export { BlockInterface };
