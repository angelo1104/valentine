import getTime from "../utils/getTime";
import range from "../utils/range";
import proofOfWork from "../utils/proofOfWork";
import hash from "../utils/hash";

interface BlockInterface {
  index: number;
  data: any;
  nonce: number;
  timestamp: number;
  prevHash: string;
  hash: string;
}

class Block {
  constructor(public block: BlockInterface) {
    this.block = block;
  }

  getString() {
    return JSON.stringify(this);
  }

  getData() {
    return JSON.stringify(this.block);
  }

  mine() {
    const maxNonce = 4000000000;

    let previousTime = getTime();

    console.log(previousTime);

    let mined = false;

    console.log("mining..");

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

          if (proofOfWork(block, 10)) {
            console.log(block, hash(block));

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
  }
}

export { Block };
export { BlockInterface };
