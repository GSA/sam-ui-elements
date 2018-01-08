import { AutocompleteCache, Cached } from './autocomplete-cache';

fdescribe('Sam Cached Class', () => {
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

fdescribe('Sam Autocomplete Cache Class', () => {
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
