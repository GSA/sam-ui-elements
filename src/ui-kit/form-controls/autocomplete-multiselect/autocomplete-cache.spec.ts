import { AutocompleteCache } from './autocomplete-cache';

fdescribe('Sam Autocomplete Cache', () => {
  let cache: AutocompleteCache;
  const defaultValue = [1, 2, 3];
  const test = 'test';
  beforeEach(() => {
    cache = new AutocompleteCache();
    cache.add(defaultValue, test);
  });

  it('Should add new values to new cache item', () => {
    const cacheString = 'test1';
    cache.add(defaultValue, cacheString);
    expect(cache.get(cacheString)).toEqual(defaultValue);
  });

  it('Should add values to an existing cache item', () => {
    const newValue = [4, 5, 6];
    const expected = [1, 2, 3, 4, 5, 6];

    cache.add(newValue, test);
    expect(cache.get(test)).toEqual(expected);
  });

  it('Should keyword and associated items from cache', () => {
    cache.remove(test);
    expect(cache.get(test)).toEqual(undefined);
  });
});
