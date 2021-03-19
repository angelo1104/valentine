import { Block } from "../libs/block";
import range from "./range";

const genesisBlock = new Block({
  index: 1,
  difficulty: 1,
  timestamp: Date.now(),
  data: {
    transactions: {
      payer: "angelo",
      receiver: "ishika",
      amount: 444,
    },
  },
  nonce: 0,
  prevHash: range(64)
    .map(() => "0")
    .join(""),
});

export default genesisBlock;
