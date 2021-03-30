import sizeof from 'object-sizeof';
import { BlockInterface } from '../graphql';
import crypto from 'crypto';
import { BlockDocument } from '../mongodb/block.schema';

export default abstract class Utils {
  // get unix time in seconds NO MILLISECONDS
  // sorry for syntax in consistency. getters are not allowed in arrow functions.
  static get time(): number {
    return Math.floor(new Date().getTime() / 1000);
  }

  // convert the data in json to maintain consistency.
  static hash = (data: any): string =>
    crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');

  static sizeOfObject = (data: any): number => sizeof(data);

  static range = (x: number): Array<number> =>
    Array.from({ length: x }, (a, index) => index);

  static proofOfWork(block: BlockInterface): boolean {
    const blockHash = this.hash(block);

    const puzzleZeroes = this.range(block.difficulty)
      .map(() => '0')
      .join('');

    // substr uses length instead of end value read more on google for difference NO substring
    return blockHash.substr(0, block.difficulty) === puzzleZeroes;
  }

  static getBlockFromDoc = (blockDoc: {
    _doc: BlockDocument;
  }): BlockInterface => {
    const { _id, __v, ...block } = blockDoc._doc;
    return block;
  };
}
