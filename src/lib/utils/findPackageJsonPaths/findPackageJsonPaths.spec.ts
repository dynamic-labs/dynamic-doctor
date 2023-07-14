import { readdirSync, statSync } from 'fs';
import { join } from 'path';

import { findPackageJsonPaths } from './findPackageJsonPaths';

jest.mock('fs');

const mockReaddirSync = readdirSync as jest.Mock;
const mockStatSync = statSync as jest.Mock;
const mockDirectory = '/path/to/directory';

describe('findPackageJsonPaths', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should find package.json paths in a directory', () => {
    const mockFiles = ['file1', 'file2', 'package.json'];
    const mockStats = {
      isDirectory: jest.fn().mockReturnValue(false),
    };

    mockReaddirSync.mockReturnValue(mockFiles);
    mockStatSync.mockReturnValue(mockStats);

    const result = findPackageJsonPaths(mockDirectory);

    expect(mockReaddirSync).toHaveBeenCalledWith(mockDirectory);
    expect(mockStatSync).toHaveBeenCalledWith(join(mockDirectory, 'file1'));
    expect(mockStatSync).toHaveBeenCalledWith(join(mockDirectory, 'file2'));
    expect(mockStatSync).toHaveBeenCalledWith(
      join(mockDirectory, 'package.json'),
    );
    expect(result).toEqual([join(mockDirectory, 'package.json')]);
  });

  it('should handle subdirectories and ignore specified paths', () => {
    const mockFiles = ['file1', 'node_modules', 'subdirectory', 'package.json'];
    const mockStats = {
      isDirectory: jest
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)
        .mockReturnValue(false),
    };

    mockReaddirSync.mockReturnValue(mockFiles);
    mockStatSync.mockReturnValue(mockStats);

    const result = findPackageJsonPaths(mockDirectory);

    expect(mockReaddirSync).toHaveBeenCalledWith(mockDirectory);
    expect(mockStatSync).toHaveBeenCalledWith(join(mockDirectory, 'file1'));
    expect(mockStatSync).not.toHaveBeenCalledWith(
      join(mockDirectory, 'node_modules'),
    );
    expect(mockStatSync).toHaveBeenCalledWith(
      join(mockDirectory, 'subdirectory'),
    );
    expect(mockStatSync).toHaveBeenCalledWith(
      join(mockDirectory, 'package.json'),
    );

    expect(result).toEqual([
      join(mockDirectory, 'subdirectory', 'package.json'),
      join(mockDirectory, 'package.json'),
    ]);
  });

  it('should return an empty array if no package.json paths are found', () => {
    const mockFiles = ['file1', 'file2'];
    const mockStats = {
      isDirectory: jest.fn().mockReturnValue(false),
    };

    mockReaddirSync.mockReturnValue(mockFiles);
    mockStatSync.mockReturnValue(mockStats);

    const result = findPackageJsonPaths(mockDirectory);

    expect(mockReaddirSync).toHaveBeenCalledWith(mockDirectory);
    expect(mockStatSync).toHaveBeenCalledWith(join(mockDirectory, 'file1'));
    expect(mockStatSync).toHaveBeenCalledWith(join(mockDirectory, 'file2'));
    expect(result).toEqual([]);
  });
});
