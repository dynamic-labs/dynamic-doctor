import { readFileSync } from 'fs';

import { findConfigFilesPaths } from '../findConfigFilesPaths';

import { getAllConfigs } from './getAllConfigs';
import {
  ConfigFileRow,
  getConfigFileAsArray,
} from './helpers/getConfigFileAsArray';

jest.mock('fs');
jest.mock('../findConfigFilesPaths');
jest.mock('./helpers/getConfigFileAsArray');

const mockFindConfigFilesPaths = findConfigFilesPaths as jest.Mock;
const mockGetConfigFileAsArray = getConfigFileAsArray as jest.Mock;
const mockReadFileSync = readFileSync as jest.Mock;

const mockCurrentPath = '/path/to/current';

describe('getAllConfigs', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    process.cwd = jest.fn().mockReturnValue(mockCurrentPath);
  });

  it('should get all package.json files correctly', () => {
    const mockPackageJsonPaths = ['/path/to/package1', '/path/to/package2'];
    const mockPackageJsonContents = [
      '{ "name": "package1", "version": "1.0.0" }',
      '{ "name": "package2", "version": "2.0.0" }',
    ];
    const mockConfigFileRows: ConfigFileRow[] = [
      { spaces: 0, text: '{' },
      { spaces: 2, text: '"name": "package1",' },
      { spaces: 2, text: '"version": "1.0.0"' },
      { spaces: 0, text: '}' },
    ];

    mockFindConfigFilesPaths.mockReturnValue(mockPackageJsonPaths);
    mockReadFileSync.mockImplementation((path: string) => {
      if (path === mockPackageJsonPaths[0]) {
        return mockPackageJsonContents[0];
      } else if (path === mockPackageJsonPaths[1]) {
        return mockPackageJsonContents[1];
      }
      return '';
    });
    mockGetConfigFileAsArray.mockReturnValue(mockConfigFileRows);

    const result = getAllConfigs();

    expect(mockFindConfigFilesPaths).toHaveBeenCalledWith(mockCurrentPath);
    expect(mockReadFileSync).toHaveBeenCalledWith(
      mockPackageJsonPaths[0],
      'utf8',
    );
    expect(mockReadFileSync).toHaveBeenCalledWith(
      mockPackageJsonPaths[1],
      'utf8',
    );
    expect(mockGetConfigFileAsArray).toHaveBeenCalledWith(
      mockPackageJsonContents[0],
      mockPackageJsonPaths[0],
    );
    expect(mockGetConfigFileAsArray).toHaveBeenCalledWith(
      mockPackageJsonContents[1],
      mockPackageJsonPaths[1],
    );
    expect(result).toEqual([
      {
        configFile: mockConfigFileRows,
        path: mockPackageJsonPaths[0],
      },
      {
        configFile: mockConfigFileRows,
        path: mockPackageJsonPaths[1],
      },
    ]);
  });

  it('should return an empty array if no package.json paths are found', () => {
    mockFindConfigFilesPaths.mockReturnValue([]);

    const result = getAllConfigs();

    expect(mockFindConfigFilesPaths).toHaveBeenCalledWith(mockCurrentPath);
    expect(result).toEqual([]);
  });
});
