/**
 * Checks if two items are equal by value rather than reference
 *
 * @param item1 - The item in question
 * @param item2 - An item to compare against
 * @returns {boolean}
 */
export function areEqual(item1: unknown, item2: unknown): boolean {
  const type1: string = typeof item1,
    type2: string = typeof item2;

  if (type1 !== type2) {
    return false;
  }

  switch (type1) {
    case "object":
      return areObjectsEqual(item1, item2);
    default:
      return item1 === item2;
  }

  /**
   * Since the typeof an object and an array are 'object' in Javascript,
   * additional type checking is needed to determine if an object is an
   * array or not.
   *
   * @param item1
   * @param item2
   * @returns {boolean}
   */
  function areObjectsEqual(item1: unknown, item2: unknown): boolean {
    // typeof null === 'object', so we have to check for null with the object
    // checks rather than with the other primitives
    if (item1 === null && item2 === null) {
      return true;
    }

    const isArray1: boolean = item1 instanceof Array,
      isArray2: boolean = item2 instanceof Array;

    if (isArray1 && isArray2) {
      return areArraysEqual(item1 as unknown[], item2 as unknown[]);
    } else if (!isArray1 && !isArray2) {
      return areNonArrayObjectsEqual(
        item1 as Record<string, unknown>,
        item2 as Record<string, unknown>
      );
    } else {
      return false;
    }
  }

  /**
   * Checks if two arrays are equal
   *
   * @param array1
   * @param array2
   *
   * @returns {boolean}
   */
  function areArraysEqual(array1: unknown[], array2: unknown[]): boolean {
    const len1: number = array1.length,
      len2: number = array2.length;

    if (len1 !== len2) {
      return false;
    } else {
      for (let i = 0; i < len1; i++) {
        const item1 = array1[i];
        const item2 = array2[i];

        if (!areEqual(item1, item2)) {
          return false;
        }
      }
      return true;
    }
  }

  /**
   * Check if two non-array objects are equal
   *
   * @param obj1
   * @param obj2
   *
   * @returns {boolean}
   */
  function areNonArrayObjectsEqual(
    obj1: Record<string, unknown>,
    obj2: Record<string, unknown>
  ): boolean {
    const keys1 = Object.keys(obj1),
      keys2 = Object.keys(obj2),
      length = keys1.length;

    if (length !== keys2.length) {
      return false;
    }

    for (let i = 0; i < length; i++) {
      const item1 = obj1[keys1[i]];
      const item2 = obj2[keys2[i]];

      if (!areEqual(item1, item2)) {
        return false;
      }
    }

    return true;
  }
}
