/**
 * Returns true if passed parameter is a string
 */
export function isString(obj: any): boolean {
  return safeTypeOf(obj) === '[object String]';
}

/**
 * Returns true if type is [object Object]
 */
export function isObject(obj: any): boolean {
  return safeTypeOf(obj) === '[object Object]';
}

/**
 * Returns true if type is [object Array]
 */
export function isArray(obj: any): boolean {
  return safeTypeOf(obj) === '[object Array]';
}

/**
 * Returns string with object type
 * Safest way to do JS typechecking
 */
export function safeTypeOf(obj: any): string {
  return Object.prototype.toString.call(obj);
}
