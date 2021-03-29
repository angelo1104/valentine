import sizeof from 'object-sizeof';
import { BlockInterface } from '../../graphql';
import { SHA256 } from 'crypto-js';

export default class Utils {
  static get time(): number {
    // get the current unix time in seconds NO MILLISECONDS
    return Math.floor(new Date().getTime() / 1000);
  }
  static hash(data: any): string {
    const json = JSON.stringify(data);
    return SHA256(json).toString();
  }
  static sizeOfObject(data: any): number {
    return sizeof(data);
  }
  static range(x: number): Array<number> {
    return Array.from({ length: x }, (a, index) => index);
  }
  static proofOfWork(block: BlockInterface): boolean {
    const blockHash = this.hash(block);

    const puzzleZeroes = this.range(block.difficulty)
      .map(() => '0')
      .join('');

    // substr uses length instead of end value read more on google for difference NO substring
    return blockHash.substr(0, block.difficulty) === puzzleZeroes;
  }
}
