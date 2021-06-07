import Block from './block';

describe('block', () => {
  it('should check for if index is valid or not', function () {
    const createBlock = () => {
      new Block({
        nonce: 10,
        difficulty: 10,
        hash: '10',
        data: 10,
        index: 10.9,
        previousHash: 'hash',
      });
    };

    expect(createBlock).toThrow();
  });
});
