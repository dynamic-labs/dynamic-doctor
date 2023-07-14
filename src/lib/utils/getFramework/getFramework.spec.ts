import fs from 'fs';

import { findPackageJsonPaths } from '../findPackageJsonPaths';

import { getFramework } from './getFramework';

jest.mock('fs');
jest.mock('../findPackageJsonPaths');

const mockFindPackageJsonPaths = findPackageJsonPaths as jest.Mock;
const mockReadFileSync = fs.readFileSync as jest.Mock;

const mockCwd = '/path/to/current';
const mockPackageJsonPaths = ['/path/to/package1'];

describe('getFramework', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    process.cwd = jest.fn().mockReturnValue(mockCwd);
  });

  it('should get framework and version correctly when astro is present', () => {
    const mockAstroPackageJson = {
      dependencies: {
        astro: '^1.0.0',
      },
    };

    mockFindPackageJsonPaths.mockReturnValue(mockPackageJsonPaths);
    mockReadFileSync.mockReturnValue(JSON.stringify(mockAstroPackageJson));

    const result = getFramework();

    expect(mockFindPackageJsonPaths).toHaveBeenCalledWith(mockCwd);
    expect(mockReadFileSync).toHaveBeenCalledWith(
      mockPackageJsonPaths[0],
      'utf8',
    );
    expect(result).toEqual({
      framework: 'astro',
      frameworkVersion: '^1.0.0',
    });
  });

  it('should get framework and version correctly when next is present', () => {
    const mockNextPackageJson = {
      dependencies: {
        next: '^10.0.0',
      },
    };

    mockFindPackageJsonPaths.mockReturnValue(mockPackageJsonPaths);
    mockReadFileSync.mockReturnValue(JSON.stringify(mockNextPackageJson));

    const result = getFramework();

    expect(mockFindPackageJsonPaths).toHaveBeenCalledWith(mockCwd);
    expect(mockReadFileSync).toHaveBeenCalledWith(
      mockPackageJsonPaths[0],
      'utf8',
    );
    expect(result).toEqual({
      framework: 'next',
      frameworkVersion: '^10.0.0',
    });
  });

  it('should get framework and version correctly when react is present', () => {
    const mockReactPackageJson = {
      dependencies: {
        react: '^17.0.0',
      },
    };

    mockFindPackageJsonPaths.mockReturnValue(mockPackageJsonPaths);
    mockReadFileSync.mockReturnValue(JSON.stringify(mockReactPackageJson));
    const result = getFramework();

    expect(mockFindPackageJsonPaths).toHaveBeenCalledWith(mockCwd);
    expect(mockReadFileSync).toHaveBeenCalledWith(
      mockPackageJsonPaths[0],
      'utf8',
    );
    expect(result).toEqual({
      framework: 'react',
      frameworkVersion: '^17.0.0',
    });
  });

  it('should return unknown framework and version if no recognized framework is present', () => {
    mockReadFileSync.mockReturnValueOnce('{}').mockReturnValueOnce('{}');

    const result = getFramework();

    expect(mockFindPackageJsonPaths).toHaveBeenCalledWith(mockCwd);
    expect(result).toEqual({
      framework: 'unknown',
      frameworkVersion: 'unknown',
    });
  });
});
