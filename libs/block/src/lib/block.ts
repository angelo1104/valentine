import { String, Number, Record, Unknown, Static } from 'runtypes';
import { getCurrentTime } from '@valentine/utils';

const PositiveInteger = Number.withConstraint((n) => n > 0 && n % 1 === 0);

const BlockSchema = Record({
  index: PositiveInteger,
  data: Unknown,
  nonce: Number,
  previousHash: String,
  hash: String,
  difficulty: Number,
  timestamp: PositiveInteger,
});

type BlockType = Static<typeof BlockSchema>;

class Block {
  protected block: BlockType;

  public readonly maxNonce = 4_000_000_000;

  constructor(block: BlockType) {
    BlockSchema.check(block);
    this.block = block;
  }

  get blockInformation(): BlockType {
    return this.block;
  }

  set setBlock(newBlock: BlockType) {
    BlockSchema.check(newBlock);
    this.block = newBlock;
  }

  async mine() {
    let previousTime: number = getCurrentTime();
    let mined = false;

    while (!mined) {
      for (let nonce = 0; nonce <= this.maxNonce; nonce += 1) {
        const currentTime = getCurrentTime();

        // time changed
        if (currentTime !== previousTime) {
          // reset the nonce
          nonce = 0;
          previousTime = currentTime;
          continue;
        }

        const block: BlockType = {
          ...this.block,
          nonce,
          timestamp: currentTime,
        };

        if (this.proofOfWork(block)) {
          this.setBlock = block;
          mined = true;
          console.log('mined');
          break;
        }
      }
    }
  }

  static proofOfWork() {}
}

export default Block;
