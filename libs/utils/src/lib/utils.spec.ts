import { getCurrentTime, hash, sizeOfObject } from './utils';

describe('hash', () => {
  const pewdiepie = 'pewdiepie';

  it('should hash using sha256', () => {
    const pewdiepieHash =
      '41bdcdc58f2bc826b96a1f17c180c070eec9d251162375999287122b421a5d27';

    expect(hash(pewdiepie)).toEqual(pewdiepieHash);
  });
});

describe('get current time', () => {
  it('should give the current time unix timestamp in seconds', function () {
    expect(getCurrentTime()).toEqual(Math.floor(Date.now() / 1000));
  });
});

describe('size of object', () => {
  it('should return 8bytes for number ', function () {
    expect(sizeOfObject(123)).toEqual(8);

    expect(sizeOfObject({ abc: 'abc' })).toBeTruthy();
  });
});
