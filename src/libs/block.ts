interface BlockInterface {
  index: number;
  data: any;
  nonce: number;
  timestamp: number;
  prevHash: string;
  hash: string;
}

class Block {
  constructor(public block: BlockInterface) {
    this.block = block;
  }

  getString() {
    return JSON.stringify(this);
  }

  getData() {
    return JSON.stringify(this.block);
  }
}

export { Block };
export { BlockInterface };
