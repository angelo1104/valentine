import Block from './block';

describe('block', () => {
  const createBlock = (invalid = false) => {
    return new Block({
      nonce: 1,
      difficulty: 1,
      hash: '10',
      data: 10,
      index: invalid ? 10.9 : 109,
      previousHash: 'hash',
      timestamp: Date.now(),
    });
  };

  it('should check for if index is valid or not', function () {
    expect(() => createBlock(true)).toThrow();
  });

  it('should check the mine function', async function () {
    const block = createBlock();

    await block.mine();

    const zeroes = Array.from({ length: block.blockInformation.difficulty })
      .fill('0')
      .join('');

    expect(
      block.currentHash.substring(0, block.blockInformation.difficulty)
    ).toEqual(zeroes);
  });

  it('should check the proof of work and mine', async function () {
    const block = createBlock();

    expect(block.validateBlock()).toBeFalsy();

    await block.mine();

    expect(block.validateBlock()).toBeTruthy();
  });
});
