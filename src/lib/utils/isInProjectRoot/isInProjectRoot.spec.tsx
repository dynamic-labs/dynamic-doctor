import { existsSync } from 'fs';

import { isInProjectRoot } from './isInProjectRoot';

jest.mock('fs');
const mockExistsSync = existsSync as jest.Mock;

describe('isInProjectRoot', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true if all required files exist', () => {
    mockExistsSync
      .mockReturnValueOnce(true) // node_modules exists
      .mockReturnValueOnce(true) // package.json exists
      .mockReturnValueOnce(true) // yarn.lock exists
      .mockReturnValueOnce(false); // package-lock.json does not exist

    const result = isInProjectRoot();

    expect(result).toBe(true);
  });

  it('should return true if all required files exist (using package-lock.json)', () => {
    mockExistsSync
      .mockReturnValueOnce(true) // node_modules exists
      .mockReturnValueOnce(true) // package.json exists
      .mockReturnValueOnce(false) // yarn.lock does not exist
      .mockReturnValueOnce(true); // package-lock.json exists

    const result = isInProjectRoot();

    expect(result).toBe(true);
  });

  it('should return false if node_modules does not exist', () => {
    mockExistsSync
      .mockReturnValueOnce(false) // node_modules does not exist
      .mockReturnValueOnce(true) // package.json exists
      .mockReturnValueOnce(false) // yarn.lock does not exist
      .mockReturnValueOnce(false); // package-lock.json exists

    const result = isInProjectRoot();

    expect(result).toBe(false);
  });

  it('should return false if package.json does not exist', () => {
    mockExistsSync
      .mockReturnValueOnce(true) // node_modules exists
      .mockReturnValueOnce(false); // package.json does not exist

    const result = isInProjectRoot();

    expect(result).toBe(false);
  });

  it('should return false if neither yarn.lock nor package-lock.json exists', () => {
    mockExistsSync
      .mockReturnValueOnce(true) // node_modules exists
      .mockReturnValueOnce(true) // package.json exists
      .mockReturnValueOnce(false) // yarn.lock does not exist
      .mockReturnValueOnce(false); // package-lock.json does not exist

    const result = isInProjectRoot();

    expect(result).toBe(false);
  });
});
