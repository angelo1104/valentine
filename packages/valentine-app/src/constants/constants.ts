import { BlockInterface } from '../graphql';
import Utils from '../utils/utils';

export default class Constants {
  static get genesisBlock(): BlockInterface {
    return {
      timestamp: 1154866516,
      data: [
        {
          payer: 'angelo',
          receiver: 'ishika',
          amount: 440,
        },
      ],
      nonce: 0,
      index: 1,
      prevHash: Utils.range(64)
        .map(() => '0')
        .join(''),
      difficulty: 1,
    };
  }

  static get chainCollection(): string {
    return 'chain';
  }
}
