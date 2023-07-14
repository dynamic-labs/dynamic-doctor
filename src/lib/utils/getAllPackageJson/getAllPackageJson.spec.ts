import { readFileSync } from 'fs';

import { findPackageJsonPaths } from '../findPackageJsonPaths';

import { getAllPackageJson } from './getAllPackageJson';
import { PackageJsonRow, getPackageJsonAsArray } from './helpers/getPackageJsonAsArray';

jest.mock('fs');
jest.mock('../findPackageJsonPaths');
jest.mock('./helpers/getPackageJsonAsArray');

const mockFindPackageJsonPaths = findPackageJsonPaths as jest.Mock;
const mockGetPackageJsonAsArray = getPackageJsonAsArray as jest.Mock;
const mockReadFileSync = readFileSync as jest.Mock;

const mockCurrentPath = '/path/to/current';

describe('getAllPackageJson', () => {
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
    const mockPackageJsonRows: PackageJsonRow[] = [
      { spaces: 0, text: '{' },
      { spaces: 2, text: '"name": "package1",' },
      { spaces: 2, text: '"version": "1.0.0"' },
      { spaces: 0, text: '}' },
    ];

    mockFindPackageJsonPaths.mockReturnValue(mockPackageJsonPaths);
    mockReadFileSync.mockImplementation((path: string) => {
      if (path === mockPackageJsonPaths[0]) {
        return mockPackageJsonContents[0];
      } else if (path === mockPackageJsonPaths[1]) {
        return mockPackageJsonContents[1];
      }
      return '';
    });
    mockGetPackageJsonAsArray.mockReturnValue(mockPackageJsonRows);

    const result = getAllPackageJson();

    expect(mockFindPackageJsonPaths).toHaveBeenCalledWith(mockCurrentPath);
    expect(mockReadFileSync).toHaveBeenCalledWith(
      mockPackageJsonPaths[0],
      'utf8',
    );
    expect(mockReadFileSync).toHaveBeenCalledWith(
      mockPackageJsonPaths[1],
      'utf8',
    );
    expect(mockGetPackageJsonAsArray).toHaveBeenCalledWith(
      mockPackageJsonContents[0],
    );
    expect(mockGetPackageJsonAsArray).toHaveBeenCalledWith(
      mockPackageJsonContents[1],
    );
    expect(result).toEqual([
      {
        packageJson: mockPackageJsonRows,
        path: mockPackageJsonPaths[0],
      },
      {
        packageJson: mockPackageJsonRows,
        path: mockPackageJsonPaths[1],
      },
    ]);
  });

  it('should return an empty array if no package.json paths are found', () => {
    mockFindPackageJsonPaths.mockReturnValue([]);

    const result = getAllPackageJson();

    expect(mockFindPackageJsonPaths).toHaveBeenCalledWith(mockCurrentPath);
    expect(result).toEqual([]);
  });
});
