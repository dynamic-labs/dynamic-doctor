import { isEmpty, isObject, mergeDeep } from './utils';

describe('utils', () => {
  describe('isObject', () => {
    it('should return true for an object', () => {
      expect(isObject({})).toBe(true);
    });
    it('should return false for an array', () => {
      expect(isObject([])).toBe(false);
    });
    it('should return false for a string', () => {
      expect(isObject('')).toBe(false);
    });
  });

  describe('mergeDeep', () => {
    it('should merge two objects', () => {
      const obj1 = {
        a: {
          b: 1,
        },
      };
      const obj2 = {
        a: {
          c: 2,
          d: {
            e: 3,
          },
        },
      };
      expect(mergeDeep(obj1, obj2)).toEqual({
        a: {
          b: 1,
          c: 2,
          d: {
            e: 3,
          },
        },
      });
    });
  });

  describe('isEmpty', () => {
    it('should return true for an empty object', () => {
      expect(isEmpty({})).toBe(true);
    });
    it('should return true for an empty array', () => {
      expect(isEmpty([])).toBe(true);
    });
    it('should return true for a string', () => {
      expect(isEmpty('')).toBe(true);
    });

    it('should return false for a non-empty object', () => {
      expect(isEmpty({ a: 1 })).toBe(false);
    });
    it('should return false for a non-empty array', () => {
      expect(isEmpty([1])).toBe(false);
    });
    it('should return false for a non-empty string', () => {
      expect(isEmpty('a')).toBe(false);
    });

    it('should return true if input is undefined', () => {
      expect(isEmpty(undefined)).toBe(true);
    });
  });
});
