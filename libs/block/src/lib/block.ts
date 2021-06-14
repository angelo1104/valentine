import { String, Number, Record, Unknown, Static } from 'runtypes';
import { getCurrentTime, hash, sizeOfObject } from '@valentine/utils';

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
  public readonly maxSize = 1_000_000;

  constructor(block: BlockType) {
    BlockSchema.check(block);
    this.block = block;
  }

  get blockInformation(): BlockType {
    return this.block;
  }

  get currentHash(): string {
    return hash(this);
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

        if (Block.proofOfWork(block)) {
          this.setBlock = block;
          mined = true;
          console.log('mined');
          return this.block;
        }
      }
    }
  }

  static proofOfWork(block: BlockType): boolean {
    BlockSchema.check(block);

    const { difficulty } = block;

    PositiveInteger.check(difficulty);

    const hashedBlock: string = new Block(block).currentHash;
    const zeroes: string = Array.from({ length: difficulty })
      .fill('0')
      .join('');

    return hashedBlock.substring(0, difficulty) === zeroes;
  }

  validateBlock(lastBlock?: BlockType): boolean {
    if (sizeOfObject(this.block) > this.maxSize) return false;

    if (lastBlock) {
      BlockSchema.check(lastBlock);

      if (!Block.proofOfWork(lastBlock)) return false;
      if (sizeOfObject(lastBlock) > this.maxSize) return false;

      if (lastBlock.hash !== this.block.previousHash) return false;

      return lastBlock.index + 1 === this.block.index;
    }

    return Block.proofOfWork(this.block);
  }
}

export default Block;
