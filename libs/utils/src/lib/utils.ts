import { createHash } from 'crypto';
import { String } from 'runtypes';

const getCurrentTime = (): number => {
  return Math.floor(Date.now() / 1000);
};

const hash = (data: unknown, hashingAlgorithm = 'sha256'): string => {
  String.check(hashingAlgorithm);

  return createHash(hashingAlgorithm)
    .update(JSON.stringify(data))
    .digest('hex');
};

const sizeOfObject = (data: unknown): number => {
  const typeSizes = {
    undefined: () => 0,
    boolean: () => 4,
    number: () => 8,
    string: (item) => 2 * item.length,
    object: (item) =>
      !item
        ? 0
        : Object.keys(item).reduce(
            (total, key) => sizeOfObject(key) + sizeOfObject(item[key]) + total,
            0
          ),
  };

  return typeSizes[typeof data](data);
};

export { getCurrentTime, hash, sizeOfObject };
