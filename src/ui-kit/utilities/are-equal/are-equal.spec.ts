import { areEqual } from './are-equal';

describe('Sam areEqual helper function', () => {

  describe('Primitive Data', () => {
    const bool = true,
          f = false,
          n = null,
          u = undefined,
          num = 11,
          zero = 0,
          str = '11',
          emptyStr = '',
          sym = Symbol('test');

    it('should compare Booleans', () => {
      const actualTruthy = areEqual(bool, true);
      const actualFalsy = areEqual(bool, false);

      expect(actualTruthy).toBe(true);
      expect(actualFalsy).toBe(false);
    });

    it('should compare Nulls', () => {
      const actualTruthy = areEqual(n, null);
      const actualFalsy = areEqual(n, str);

      expect(actualTruthy).toBe(true);
      expect(actualFalsy).toBe(false);
    });

    it('should compare Undefineds', () => {
      const actualTruthy = areEqual(u, undefined);
      const actualFalsy = areEqual(u, n);

      expect(actualTruthy).toBe(true);
      expect(actualFalsy).toBe(false);
    });

    it('should compare Numbers', () => {
      const testNumT = 11;
      const testNumF = 12;

      const actualTruthy = areEqual(num, testNumT);
      const actualFalsy = areEqual(num, testNumF);

      expect(actualTruthy).toBe(true);
      expect(actualFalsy).toBe(false);
    });

    it('should compare Strings', () => {
      const testStrT = '11';
      const testStrF = '12';

      const actualTruthy = areEqual(str, testStrT);
      const actualFalsy = areEqual(str, testStrF);

      expect(actualTruthy).toBe(true);
      expect(actualFalsy).toBe(false);
    });

    it('should compare Symbols (always false)', () => {
      const testSym = Symbol('test');
      const actual = areEqual(sym, testSym);

      expect(actual).toBe(false);
    });

    describe('If types are dissimilar', () => {
      it('should not coerce strings and numbers', () => {
        const actual = areEqual(str, num);
        expect(actual).toBe(false);
      });

      describe('If values are falsy,', () => {
        it('should not equate empty string to null', () => {
          const actual = areEqual(emptyStr, n);
          expect(actual).toBe(false);
        });

        it('should not equate empty string to false', () => {
          const actual = areEqual(emptyStr, f);
          expect(actual).toBe(false);
        });

        it('should not equate empty string to 0', () => {
          const actual = areEqual(emptyStr, zero);
          expect(actual).toBe(false);
        });

        it('should not equate empty string to undefined', () => {
          const actual = areEqual(emptyStr, u);
          expect(actual).toBe(false);
        });

        it('should not equate null to false', () => {
          const actual = areEqual(n, f);
          expect(actual).toBe(false);
        });

        it('should not equate null to 0', () => {
          const actual = areEqual(n, zero);
          expect(actual).toBe(false);
        });

        it('should not equate null to undefined', () => {
          const actual = areEqual(n, u);
          expect(actual).toBe(false);
        });

        it('should not equate false to 0', () => {
          const actual = areEqual(f, zero);
          expect(actual).toBe(false);
        });

        it('should not equate false to undefined', () => {
          const actual = areEqual(f, u);
          expect(actual).toBe(false);
        });

        it('should not equate 0 to undefined', () => {
          const actual = areEqual(zero, u);
          expect(actual).toBe(false);
        });
      });
    });
  });

  describe('Compound Data Checks', () => {
    describe('Non-Array Objects', () => {

      const mock1 = { key: 'key', value: 'value' },
            mock2 = { key: 'key', value: 'malue' },
            mock1Clone = {...mock1},
            mock4 = {...mock1, category: 'Jumanji' }

      it('should pass if objects have same keys and values', () => {
        const actual = areEqual(mock1, mock1Clone);
        expect(actual).toBe(true);
      })

      it('should fail if objects have same keys and different values', () => {
        const actual = areEqual(mock1, mock2);
        expect(actual).toBe(false);
      });

      it('should return false if objects have different numbers of keys', () => {
        const actual = areEqual(mock1, mock4);
        expect(actual).toBe(false);
      });
    });

    describe('Arrays', () => {
      const array1 = ['one', 'two', 'three'],
            array1Clone = [].concat(array1),
            array2 = ['one', 'two', 'tree'],
            array3 = ['one', 'two', 'three', 'four'];

      it('should return true if arrays have same value', () => {
        const actual = areEqual(array1, array1Clone);
        expect(actual).toBe(true);
      });

      it('should return false if arrays have differnt values', () => {
        const actual = areEqual(array1, array2);
        expect(actual).toBe(false);
      });

      it('should return false if arrays have different lengths', () => {
        const actual = areEqual(array1, array3);
        expect(actual).toBe(false);
      });
    });

    describe('Nested Objects and Arrays', () => {
      const mock1 = {
        key: 'key',
        value: 'value',
        categories: [
          { name: 'name1', id: 1 },
          { name: 'name2', id: 2 },
          { name: 'name3', id: 3 },
          { name: 'name4', id: 4 },
          { name: 'name5', id: 5 },
        ],
        children: {
          parent: 'mock1',
          nodes: [
            {
              children: [
                { key: 'key1', value: 'value1' },
                { key: 'key2', value: 'value3' }
              ]
            }
          ]
        }
      };

      const mock1Clone = {...mock1};

      const mock2 = {
        key: 'key',
        value: 'value',
        categories: [
          { name: 'name1', id: 1 },
          { name: 'name2', id: 2 },
          { name: 'name3', id: 3 },
          { name: 'name4', id: 4 },
        ],
        children: {
          parent: 'mock1',
          nodes: [
            {
              children: [
                { key: 'key1', value: 'value1' },
                { key: 'key2', value: 'value3' }
              ]
            }
          ]
        }
      };

      const mock3 = {
        key: 'key',
        value: 'value',
        categories: [
          { name: 'name1', id: 1 },
          { name: 'name2', id: 2 },
          { name: 'name3', id: 3 },
          { name: 'name4', id: 4 },
          { name: 'name5', id: 5 },
        ],
        children: {
          parent: 'mock4',
          nodes: [
            {
              children: [
                { key: 'key1', value: 'value1' },
                { key: 'key2', value: 'value3' }
              ]
            }
          ]
        }
      };

      const mock4 = {
        key: 'key',
        value: 'value',
        categories: [
          { name: 'name1', id: 1 },
          { name: 'name2', id: 2 },
          { name: 'name3', id: 3 },
          { name: 'name4', id: 4 },
          { name: 'name5', id: 5 },
        ],
        children: {
          parent: 'mock1',
          nodes: [
            {
              children: [
                { key: 'key1', value: 'value1' },
                { key: 'key2', value: 'value8' }
              ]
            }
          ]
        }
      };

      it('should return true if given clone', () => {
        const actual = areEqual(mock1, mock1Clone);
        expect(actual).toBe(true);
      });

      it('should fail if nested objects or children aren\'t equivalent', () => {
        const actual1 = areEqual(mock1, mock2);
        expect(actual1).toBe(false);

        const actual2 = areEqual(mock1, mock3);
        expect(actual2).toBe(false);

        const actual3 = areEqual(mock1, mock4);
        expect(actual3).toBe(false);
      });
    });
  })
});