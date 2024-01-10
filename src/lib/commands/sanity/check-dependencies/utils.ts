import { DeepPartial } from './types';

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: any): item is object {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep<T extends Record<string, any>>(
  target: T,
  ...sources: DeepPartial<T>[]
): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export const isEmpty = (obj: any) => {
  return Object.keys(obj ?? {}).length === 0 || JSON.stringify(obj) === '{}';
};
