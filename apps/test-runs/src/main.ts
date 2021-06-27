import Block from '@valentine/block';
import { hash } from '@valentine/utils';

const block = new Block({
  nonce: 1,
  difficulty: 3,
  data: 10,
  index: 109,
  previousHash: 'hash',
  timestamp: Date.now(),
});

console.log('gonna mine');

async function miner() {
  const mined = await block.mine();
  if (!mined) {
    console.log('grouped');
  }
  console.log('mined', mined);
}

miner();

console.log('doing the freak');
