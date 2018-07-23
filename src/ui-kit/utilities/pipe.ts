export function pipe (...fns) {

  return fns.reduce(_pipe);

  function _pipe (f, g) {
    return function (...args) {
      return g(f(...args));
    }
  }
}

const a = x => x + 1;
const b = y => y + 10;
const add = pipe(a, b);
const result = add(10);

console.log(result === 21);
console.log('test');
