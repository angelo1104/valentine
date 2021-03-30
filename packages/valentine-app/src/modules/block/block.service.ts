import { Injectable } from '@nestjs/common';
import { BlockInterface } from '../../graphql';
import Utils from '../../utils/utils';

// the block class. Keep it safe, do not give direct exposure only through nest service.
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

  get hash(): string {
    return Utils.hash(this.block);
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

  verifyBlock(lastBlock?: BlockInterface): boolean {
    const verifyIndividualBlock = (): boolean => {
      if (!Utils.proofOfWork(this.block)) return false;
      if (this.block.nonce > this.maxNonce || this.block.nonce < 0)
        return false;

      // if size of block is less or equal to 1 mb or this much bytes
      return Utils.sizeOfObject(this.block) <= 1000000;
    };

    if (lastBlock) {
      // if index is not valid
      if (lastBlock.index + 1 !== this.block.index) return false;

      // if previous hash is not valid
      if (Utils.hash(lastBlock) !== this.block.prevHash) return false;
    }

    return verifyIndividualBlock();
  }
}

// the block service
@Injectable()
export class BlockService {
  block(block: BlockInterface): Block {
    return new Block(block);
  }
}

export type { Block };
