import sizeof from "object-sizeof";
import getTime from "../utils/getTime";
import proofOfWork from "../utils/proofOfWork";

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

  constructor(block: BlockInterface) {
    this.block = block;
  }

  getBlock() {
    return this.block;
  }

  getBlockData() {
    return JSON.stringify(this.block);
  }

  mine(): BlockInterface {
    console.log("mining..");
    const maxNonce = 4000000000;
    let previousTime = getTime();
    let mined = false;

    while (!mined) {
      for (let nonce = 0; nonce <= maxNonce; nonce += 1) {
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

  verifyBlock() {
    if (!proofOfWork(this.block, this.block.difficulty)) return false;

    const maxNonce = 4000000000;
    if (this.block.nonce > maxNonce || this.block.nonce < 0) return false;

    // if size fo block is less than 1mb or 1 million bytes
    if (sizeof(this.block) > 1000000) return false;

    return true;
  }
}

export { Block };
export { BlockInterface };
