import { DYNAMIC_PACKAGES, IGNORE_PACKAGES } from './constants';
import { DeepPartial } from './types';

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: any): item is object {
  return Boolean(item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep<T extends Record<string, any>>(
  target: T,
  ...sources: DeepPartial<T | Record<string, any>>[]
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

export const isDynamicPackage = (...dynamicRefs: string[]) => {
  const refs = dynamicRefs.flat().map((ref) => ref.split(':'));
  return refs.some((ref) => {
    return ref.some((refPart) => {
      return DYNAMIC_PACKAGES.some(
        (p) => p.test(refPart) && !isIgnoredPackage(refPart),
      );
    });
  });
};

export const isIgnoredPackage = (packageName: string) => {
  return IGNORE_PACKAGES.includes(packageName);
};
