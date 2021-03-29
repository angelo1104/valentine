import { BlockInterface } from '../../graphql';
import Utils from '../utils/utils';

class Block {
  constructor(
    private block: BlockInterface,
    public readonly maxNonce = 4000000000,
  ) {}

  get blockInformation(): BlockInterface {
    return this.block;
  }

  set blockInformation(newBlock: BlockInterface) {
    this.block = newBlock;
  }

  mine(): BlockInterface {
    console.log('mining..mine the mine');
    let previousTime: number = Utils.time;
    let mined = false;

    while (!mined) {
      for (let nonce = 0; nonce <= this.maxNonce; nonce += 1) {
        const currentTime = Utils.time;

        // time changed
        if (currentTime !== previousTime) {
          // reset the nonce
          nonce = 0;
          previousTime = currentTime;
          continue;
        }

        const block: BlockInterface = {
          ...this.block,
          nonce,
          timestamp: currentTime,
        };

        if (Utils.proofOfWork(block)) {
          this.block = block;
          mined = true;
          console.log('mined');
          break;
        }
      }
    }

    return this.block;
  }
}

export default Block;
