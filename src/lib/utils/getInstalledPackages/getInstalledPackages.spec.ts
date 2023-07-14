import { execSync } from 'child_process';

import { getInstalledPackages } from './getInstalledPackages';

jest.mock('child_process');
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

describe('getInstalledPackages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the installed packages correctly', () => {
    const mockNpmLsOutput = `
      ├── @dynamic-labs/package-1@1.0.0
      ├── @dynamic-labs/package-2@2.0.0
      ├── @dynamic-labs/package-3@3.0.0
      ├── @dynamic-labs/passport-dynamic@1.0.0
      ├── package-a@1.0.0
      └── package-b@2.0.0
    `;

    mockExecSync.mockReturnValue(Buffer.from(mockNpmLsOutput));

    const result = getInstalledPackages();

    expect(mockExecSync).toHaveBeenCalledWith('npm ls');
    expect(result).toEqual({
      '@dynamic-labs/package-1': '1.0.0',
      '@dynamic-labs/package-2': '2.0.0',
      '@dynamic-labs/package-3': '3.0.0',
    });
  });

  it('should exclude non-dynamic-labs packages and passport-dynamic package', () => {
    const mockNpmLsOutput = `
      ├── @dynamic-labs/package-1@1.0.0
      ├── package-x@1.0.0
      ├── @dynamic-labs/package-2@2.0.0
      ├── @dynamic-labs/passport-dynamic@1.0.0
      └── package-y@2.0.0
    `;

    mockExecSync.mockReturnValue(Buffer.from(mockNpmLsOutput));

    const result = getInstalledPackages();

    expect(mockExecSync).toHaveBeenCalledWith('npm ls');
    expect(result).toEqual({
      '@dynamic-labs/package-1': '1.0.0',
      '@dynamic-labs/package-2': '2.0.0',
    });
  });

  it('should return an empty object if no dynamic-labs packages are installed', () => {
    const mockNpmLsOutput = `
      ├── package-x@1.0.0
      ├── package-y@2.0.0
      └── package-z@3.0.0
    `;

    mockExecSync.mockReturnValue(Buffer.from(mockNpmLsOutput));

    const result = getInstalledPackages();

    expect(mockExecSync).toHaveBeenCalledWith('npm ls');
    expect(result).toEqual({});
  });
});
