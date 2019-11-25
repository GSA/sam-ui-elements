import { AutocompleteCache, Cached } from './autocomplete-cache';

describe('Sam Cached Class', () => {
  let cached: Cached;
  const name = 'test';
  const initialValue = [{key: 1}, {key: 2}, {key: 3}, {key: 4}];

  beforeEach(() => {
    cached = new Cached(name, initialValue);
  });

  it('Should create new Cached with initial name and value', () => {
    expect(cached.name).toEqual(name);
    expect(cached.value).toEqual(initialValue);
    expect(cached.lastValue).toEqual(initialValue);
  });

  it('Should insert value into cache', () => {
    const newValue = [{key: 5}, {key: 6}, {key: 7}, {key: 8}];
    const expected = [...initialValue, ...newValue];

    cached.insert(newValue);

    expect(cached.value).toEqual(expected);
    // expect(cached.lastValue).toEqual(newValue);
  });

  it('Should clear value from cache', () => {
    cached.clear();
    expect(cached.value).toEqual([]);
    expect(cached.lastValue).toEqual([]);
  });

  it('Should return correct byte size for cached items', () => {
    const initialByteSize = 41;
    expect(cached.byteSize).toEqual(initialByteSize);
  });

});

describe('Sam Autocomplete Cache Class', () => {
  let cache: AutocompleteCache;
  const testKey = 'test';
  const testValue = [{key: 1}, {key: 2}, {key: 3}, {key: 4}];
  beforeEach(() => {
    cache = new AutocompleteCache();
  });

  it('Should insert keyed value into cache and get results', () => {
    cache.insert(testValue, testKey);

    expect(cache.get(testKey)).toEqual(testValue);
  });

  it('Should insert value into default cache and get results', () => {
    cache.insert(testValue);

    expect(cache.get()).toEqual(testValue);
  });

  it('Should remove keyed value from cache', () => {
    cache.insert(testValue, testKey);
    cache.remove(testKey);

    expect(cache.get(testKey)).toEqual([]);
  });

  it('Should clear keyed cache', () => {
    cache.insert(testValue, testKey);
    cache.clear();

    expect(cache.get(testKey)).toEqual([]);
  });

  it('Should clear keyed and default cache', () => {
    cache.insert(testValue, testKey);
    cache.insert(testValue);
    cache.clearAll();

    expect(cache.get()).toEqual([]);
    expect(cache.get(testKey)).toEqual([]);
  });

  it('Should get totalByteSize of cache', () => {
    const expectedByteSize = 82;

    cache.insert(testValue, testKey);
    cache.insert(testValue);

    expect(cache.totalBytes).toEqual(expectedByteSize);
  });

  it('Should return last keyed stored in cache', () => {
    const moreValues = [{key: 7}, {key: 8}, {key: 9}];
    cache.insert(testValue, testKey);
    cache.insert(testValue);
    cache.insert(moreValues, testKey);

    expect(cache.lastSearched).toEqual(testKey);

    cache.insert(moreValues);

    expect(cache.lastSearched).toEqual('default');
  });

  it('Should return last value added to cache', () => {
    const moreValues = [{key: 7}, {key: 8}, {key: 9}];
    const evenMoreValues = [{key: 11}, {key: 12}, {key: 13}];
    cache.insert(testValue, testKey);
    cache.insert(testValue);
    cache.insert(moreValues, testKey);

    expect(cache.lastAdded).toEqual(moreValues);

    cache.insert(evenMoreValues, testKey);
    cache.insert(moreValues);

    expect(cache.lastAdded).toEqual(moreValues);
  });
});

describe('Autocomplete Cache arraysEqual method', () => {
  const initialArray = [{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }];

  it('should return true if arrays are equal ', () => {
    const mockArray = [{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }];
    const actual = AutocompleteCache.arraysEqual(initialArray, mockArray);
    expect(actual).toBe(true);
  });

  it('should return false if arrays are not equal', () => {
    const mockArray = [{ key: 10 }, { key: 2 }, { key: 3 }, { key: 4 }];
    const actual = AutocompleteCache.arraysEqual(initialArray, mockArray);
    expect(actual).toBe(false);
  });
  
  it('should return true if  string arrays are  equal', () => {
    const options = ['apple', 'orange', 'grape', 'banana', 'pineapple'];
    const options1 = ['apple', 'orange', 'grape', 'banana', 'pineapple'];
    const actual = AutocompleteCache.arraysEqual(options, options1);
    expect(actual).toBe(true);
  });

  it('should return false if string array are not equal', () => {
    const options = [ 'orange', 'grape', 'banana', 'pineapple'];
    const options1 = ['apple', 'orange', 'grape', 'banana', 'pineapple'];
    const actual = AutocompleteCache.arraysEqual(options, options1);
    expect(actual).toBe(false);
  });
  
  it('should return true if object arrays are equal ', () => {
    const objArray = [{
      code: 'code01',
      value: 'apple'
    }, {
      code: 'code02',
      value: 'orange'
    }, {
      code: 'code03',
      value: 'grape'
    }, {
      code: 'code04',
      value: 'banana'
    }, {
      code: 'code05',
      value: 'pineapple'
    }];

    const objArray1 = [{
      code: 'code01',
      value: 'apple'
    }, {
      code: 'code02',
      value: 'orange'
    }, {
      code: 'code03',
      value: 'grape'
    }, {
      code: 'code04',
      value: 'banana'
    }, {
      code: 'code05',
      value: 'pineapple'
    }];
    const actual = AutocompleteCache.arraysEqual(objArray, objArray1);
    expect(actual).toBe(true);
  });

  it('should return false if object arrays are not equal', () => {
    const objArray = [{
      code: 'code01',
      value: 'apple'
    }, {
      code: 'code02',
      value: 'orange'
    }, {
      code: 'code03',
      value: 'grape'
    }, {
      code: 'code04',
      value: 'banana'
    }, {
      code: 'code05',
      value: 'pineapple'
    }];

    const objArray1 = [ {
      code: 'code02',
      value: 'orange'
    }, {
      code: 'code03',
      value: 'grape'
    }, {
      code: 'code04',
      value: 'banana'
    }, {
      code: 'code05',
      value: 'pineapple'
    }];
    const actual = AutocompleteCache.arraysEqual(objArray, objArray1);
    expect(actual).toBe(false);
  });

});
