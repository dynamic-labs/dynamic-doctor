import { execSync } from 'child_process';

import { getInstalledPackages } from './getInstalledPackages';
import { getPackageManager } from '../getPackageManager';

jest.mock('child_process');
jest.mock('../getPackageManager');
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
const mockGetPackageManager = getPackageManager as jest.MockedFunction<
  typeof getPackageManager
>;

describe('getInstalledPackages', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetPackageManager.mockReturnValue({
      packageManager: 'npm',
      packageManagerVersion: '7.19.1',
    });
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

  it('should return the installed packages correctly for pnpm', () => {
    const mockNpmLsOutput = `
    +-- @dynamic-labs/sdk-react@0.18.8 -> ./node_modules/.pnpm/@dynamic-labs+sdk-react@0.18.8_@babel+core@7.22.11_@dynamic-labs+logger@0.18.8_@dynamic-labs+_vw5snfujc4zocxdbb4h3pbdqvu/node_modules/@dynamic-labs/sdk-react
    +-- @eslint-community/eslint-utils@4.4.0 extraneous -> ./node_modules/.pnpm/@eslint-community+eslint-utils@4.4.0_eslint@8.47.0/node_modules/@eslint-community/eslint-utils
    +-- @eslint-community/regexpp@4.7.0 extraneous -> ./node_modules/.pnpm/@eslint-community+regexpp@4.7.0/node_modules/@eslint-community/regexpp
    +-- @eslint/eslintrc@2.1.2 extraneous -> ./node_modules/.pnpm/@eslint+eslintrc@2.1.2/node_modules/@eslint/eslintrc
    +-- @eslint/js@8.47.0 extraneous -> ./node_modules/.pnpm/@eslint+js@8.47.0/node_modules/@eslint/js
    \`-- eslint-scope@7.2.2 extraneous -> ./node_modules/.pnpm/eslint-scope@7.2.2/node_modules/eslint-scope
    `;

    mockExecSync.mockReturnValue(Buffer.from(mockNpmLsOutput));

    const result = getInstalledPackages();

    expect(mockExecSync).toHaveBeenCalledWith('npm ls');
    expect(result).toEqual({
      '@dynamic-labs/sdk-react': '0.18.8',
    });
  });

  it('should use bun to check for packages', () => {
    mockGetPackageManager.mockReturnValue({
      packageManager: 'bun',
      packageManagerVersion: '1.0.1',
    });

    const mockNpmLsOutput = `
    +-- @dynamic-labs/sdk-react@0.18.8 -> ./node_modules/.pnpm/@dynamic-labs+sdk-react@0.18.8_@babel+core@7.22.11_@dynamic-labs+logger@0.18.8_@dynamic-labs+_vw5snfujc4zocxdbb4h3pbdqvu/node_modules/@dynamic-labs/sdk-react
    +-- @eslint-community/eslint-utils@4.4.0 extraneous -> ./node_modules/.pnpm/@eslint-community+eslint-utils@4.4.0_eslint@8.47.0/node_modules/@eslint-community/eslint-utils
    +-- @eslint-community/regexpp@4.7.0 extraneous -> ./node_modules/.pnpm/@eslint-community+regexpp@4.7.0/node_modules/@eslint-community/regexpp
    +-- @eslint/eslintrc@2.1.2 extraneous -> ./node_modules/.pnpm/@eslint+eslintrc@2.1.2/node_modules/@eslint/eslintrc
    +-- @eslint/js@8.47.0 extraneous -> ./node_modules/.pnpm/@eslint+js@8.47.0/node_modules/@eslint/js
    \`-- eslint-scope@7.2.2 extraneous -> ./node_modules/.pnpm/eslint-scope@7.2.2/node_modules/eslint-scope
    `;

    mockExecSync.mockReturnValue(Buffer.from(mockNpmLsOutput));

    const result = getInstalledPackages();

    expect(mockExecSync).toHaveBeenCalledWith('bun pm ls');
    expect(result).toEqual({
      '@dynamic-labs/sdk-react': '0.18.8',
    });
  });

  it('should use pnpm to check for packages', () => {
    mockGetPackageManager.mockReturnValue({
      packageManager: 'pnpm',
      packageManagerVersion: '1.0.1',
    });

    const mockNpmLsOutput = `
    Legend: production dependency, optional only, dev only

    pnpm-test@1.0.0 /Users/bartosz.kownacki/Documents/repos/pnpm-test
    
    dependencies:
    @dynamic-labs/sdk-api 0.0.321
    @dynamic-labs/sdk-react-core 0.19.5
    @dynamic-labs/wagmi-connector 0.19.5
    typescript 5.3.2
    `;

    mockExecSync.mockReturnValue(Buffer.from(mockNpmLsOutput));

    const result = getInstalledPackages();

    expect(mockExecSync).toHaveBeenCalledWith('pnpm ls');
    expect(result).toEqual({
      '@dynamic-labs/sdk-react-core': '0.19.5',
      '@dynamic-labs/wagmi-connector': '0.19.5',
    });
  });
});
