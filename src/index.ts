import { Block } from "./libs/block";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Array.range = function (a, b, step) {
  let A = [];
  if (typeof a === "number") {
    A[0] = a;
    // eslint-disable-next-line no-param-reassign
    step = step || 1;
    while (a + step <= b) {
      // eslint-disable-next-line no-multi-assign,no-param-reassign
      A[A.length] = a += step;
    }
  } else {
    let s = "abcdefghijklmnopqrstuvwxyz";
    if (a === a.toUpperCase()) {
      // eslint-disable-next-line no-param-reassign
      b = b.toUpperCase();
      s = s.toUpperCase();
    }
    s = s.substring(s.indexOf(a), s.indexOf(b) + 1);
    A = s.split("");
  }
  return A;
};

const block = new Block({
  data: "hola",
  hash: "ho",
  index: 2,
  nonce: 3,
  prevHash: "4",
  timestamp: 5,
});

block.mine();
