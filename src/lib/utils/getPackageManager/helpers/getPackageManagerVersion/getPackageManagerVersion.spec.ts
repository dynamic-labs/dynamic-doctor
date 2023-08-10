import { execSync } from 'child_process';

import { getPackageManagerVersion } from './getPackageManagerVersion';

jest.mock('child_process');
jest.mock('../../../loggers/DoctorLogger');

const mockExecSync = execSync as jest.Mock;

describe('getPackageManagerVersion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get package manager version correctly', () => {
    const mockPackageManager = 'npm';
    const mockVersion = '7.19.1';
    mockExecSync.mockReturnValue(Buffer.from(mockVersion));

    const result = getPackageManagerVersion(mockPackageManager);

    expect(mockExecSync).toHaveBeenCalledWith(`${mockPackageManager} -v`);
    expect(result).toBe(mockVersion);
  });

  it('should handle error and log an error message', () => {
    const mockPackageManager = 'yarn';
    const mockErrorMessage = 'Mock error message';
    const mockError = new Error(mockErrorMessage);
    mockExecSync.mockImplementation(() => {
      throw mockError;
    });

    const result = getPackageManagerVersion(mockPackageManager);

    expect(mockExecSync).toHaveBeenCalledWith(`${mockPackageManager} -v`);
    expect(result).toBe('unknown');
  });
});
