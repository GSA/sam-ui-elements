import { pipe } from './pipe';

describe('Pipe function', () => {

  it('Should create a function pipeline', () => {
    const a = x => x + 1;
    const b = y => y + 10;
    const c = z => z * 2;

    const testValue = 10;
    const expected = 42;

    const pipeline = pipe(a, b, c);

    expect(pipeline(testValue)).toEqual(expected);
  });
})