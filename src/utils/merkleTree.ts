import hash from "./hash";

const MerkleTree = {
  generateMerkleTree(data: any[]) {
    const root = [];
    root.unshift(data);
    root.unshift(data.map((t) => t.hash));

    while (root[0].length > 1) {
      const temp: string[] = [];

      for (let index = 0; index < root[0].length; index += 2) {
        if (index < root[0].length - 1 && index % 2 === 0)
          temp.push(hash(root[0][index] + root[0][index + 1]));
        else temp.push(root[0][index]);
      }
      root.unshift(temp);
    }

    return root[0][0];
  },
  verifyRoot(root: string, data: any[]) {
    if (root === this.generateMerkleTree(data)) return true;

    return false;
  },
};

export default MerkleTree;
