import getTime from "../utils/getTime";
import proofOfWork from "../utils/proofOfWork";

interface BlockInterface {
  index: number;
  data: any;
  nonce: number;
  timestamp: number;
  prevHash: string;
  hash: string;
}

class Block {
  private block: BlockInterface;

  public readonly difficulty: number;

  constructor(block: BlockInterface, difficulty: number) {
    this.block = block;
    this.difficulty = difficulty;
  }

  getString() {
    return JSON.stringify(this);
  }

  getBlock() {
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

          if (proofOfWork(block, this.difficulty)) {
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
}

export { Block };
export { BlockInterface };
