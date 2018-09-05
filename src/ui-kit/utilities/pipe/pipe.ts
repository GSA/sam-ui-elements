export function pipe (...fns) {

  return fns.reduce(_pipe);

  function _pipe (f, g) {
    return function (...args) {
      return g(f(...args));
    }
  }
}
