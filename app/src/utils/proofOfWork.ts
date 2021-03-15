import { BlockInterface } from "../libs/block";
import hash from "./hash";
import range from "./range";

const proofOfWork = (block: BlockInterface, difficulty: number): boolean => {
  const blockHash = hash(block);

  const puzzleZeroes = range(difficulty)
    .map(() => "0")
    .join("");

  // substr uses length instead of end value read more on google for difference

  if (blockHash.substr(0, difficulty) === puzzleZeroes) return true;

  return false;
};

export default proofOfWork;
