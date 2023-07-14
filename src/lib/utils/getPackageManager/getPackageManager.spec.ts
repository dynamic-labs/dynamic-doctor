import { existsSync } from 'fs';

import { getPackageManagerVersion } from './helpers/getPackageManagerVersion';
import { getPackageManager } from './getPackageManager';

jest.mock('fs');
jest.mock('./helpers/getPackageManagerVersion');

const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockGetPackageManagerVersion =
  getPackageManagerVersion as jest.MockedFunction<
    typeof getPackageManagerVersion
  >;

describe('getPackageManager', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return npm as the package manager', () => {
    const mockPackageManager = 'npm';
    const mockPackageManagerVersion = '7.19.1';

    mockExistsSync.mockReturnValueOnce(true).mockReturnValue(false);
    mockGetPackageManagerVersion.mockReturnValue(mockPackageManagerVersion);

    const result = getPackageManager();

    expect(mockExistsSync).toHaveBeenCalledWith('./package-lock.json');
    expect(mockExistsSync).not.toHaveBeenCalledWith('./yarn.lock');
    expect(mockExistsSync).not.toHaveBeenCalledWith('./pnpm-lock.yaml');
    expect(mockGetPackageManagerVersion).toHaveBeenCalledWith(
      mockPackageManager,
    );
    expect(result).toEqual({
      packageManager: mockPackageManager,
      packageManagerVersion: mockPackageManagerVersion,
    });
  });

  it('should return yarn as the package manager', () => {
    const mockPackageManager = 'yarn';
    const mockPackageManagerVersion = '1.22.10';

    mockExistsSync
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);
    mockGetPackageManagerVersion.mockReturnValue(mockPackageManagerVersion);

    const result = getPackageManager();

    expect(mockExistsSync).toHaveBeenCalledWith('./package-lock.json');
    expect(mockExistsSync).toHaveBeenCalledWith('./yarn.lock');
    expect(mockExistsSync).not.toHaveBeenCalledWith('./pnpm-lock.yaml');
    expect(mockGetPackageManagerVersion).toHaveBeenCalledWith(
      mockPackageManager,
    );
    expect(result).toEqual({
      packageManager: mockPackageManager,
      packageManagerVersion: mockPackageManagerVersion,
    });
  });

  it('should return pnpm as the package manager', () => {
    const mockPackageManager = 'pnpm';
    const mockPackageManagerVersion = '6.16.1';

    mockExistsSync
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    mockGetPackageManagerVersion.mockReturnValue(mockPackageManagerVersion);

    const result = getPackageManager();

    expect(mockExistsSync).toHaveBeenCalledWith('./package-lock.json');
    expect(mockExistsSync).toHaveBeenCalledWith('./yarn.lock');
    expect(mockExistsSync).toHaveBeenCalledWith('./pnpm-lock.yaml');
    expect(mockGetPackageManagerVersion).toHaveBeenCalledWith(
      mockPackageManager,
    );
    expect(result).toEqual({
      packageManager: mockPackageManager,
      packageManagerVersion: mockPackageManagerVersion,
    });
  });

  it('should return unknown as the package manager', () => {
    const mockPackageManager = 'unknown';

    mockExistsSync.mockReturnValue(false);

    mockGetPackageManagerVersion.mockReturnValue(mockPackageManager);

    const result = getPackageManager();

    expect(mockGetPackageManagerVersion).toHaveBeenCalledWith(
      mockPackageManager,
    );
    expect(result).toEqual({
      packageManager: mockPackageManager,
      packageManagerVersion: mockPackageManager,
    });
  });
});
