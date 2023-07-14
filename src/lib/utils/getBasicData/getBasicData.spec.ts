import { getPackageManager } from '../getPackageManager';
import { getPlatform } from '../getPlatform';
import { getFramework } from '../getFramework';

import { getBasicData } from './getBasicData';

jest.mock('../getPlatform');
jest.mock('../getFramework');
jest.mock('../getPackageManager');

const mockGetPlatform = getPlatform as jest.MockedFunction<typeof getPlatform>;
const mockGetFramework = getFramework as jest.MockedFunction<
  typeof getFramework
>;
const mockGetPackageManager = getPackageManager as jest.MockedFunction<
  typeof getPackageManager
>;

const mockFramework = 'react';
const mockFrameworkVersion = '17.0.2';
const mockNodeVersion = '14.17.0';
const mockCpuArch = 'x64';
const mockPlatform = 'linux';
const mockPackageManager = 'npm';
const mockPackageManagerVersion = '7.19.1';

describe('getBasicData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get basic data correctly', () => {
    mockGetFramework.mockReturnValue({
      framework: mockFramework,
      frameworkVersion: mockFrameworkVersion,
    });
    mockGetPlatform.mockReturnValue({
      node: mockNodeVersion,
      cpuArch: mockCpuArch,
      platform: mockPlatform,
    });
    mockGetPackageManager.mockReturnValue({
      packageManager: mockPackageManager,
      packageManagerVersion: mockPackageManagerVersion,
    });

    const result = getBasicData();

    expect(mockGetFramework).toHaveBeenCalled();
    expect(mockGetPlatform).toHaveBeenCalled();
    expect(mockGetPackageManager).toHaveBeenCalled();
    expect(result).toEqual({
      framework: {
        name: mockFramework,
        version: mockFrameworkVersion,
      },
      node: {
        name: 'node',
        version: mockNodeVersion,
      },
      packageManager: {
        name: mockPackageManager,
        version: mockPackageManagerVersion,
      },
      platform: {
        name: mockPlatform,
        version: mockCpuArch,
      },
    });
  });
});
