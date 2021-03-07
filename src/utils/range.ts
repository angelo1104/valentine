function range(x: number): Array<number> {
  return Array.from({ length: x + 1 }, (a, i) => i);
}

export default range;
