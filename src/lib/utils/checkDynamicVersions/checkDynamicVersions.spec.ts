import chalk from 'chalk';

import { getPackageManager } from '../getPackageManager';
import { DoctorLogger } from '../loggers/DoctorLogger';
import { getInstalledPackages } from '../getInstalledPackages';
import { getInstallCommand } from '../getInstallCommand';

import { checkDynamicVersions } from './checkDynamicVersions';

jest.mock('../getPackageManager');
jest.mock('../getInstalledPackages');
jest.mock('../getInstallCommand');
jest.mock('../loggers/DoctorLogger');

const mockGetInstalledPackages = getInstalledPackages as jest.MockedFunction<
  typeof getInstalledPackages
>;
const mockGetPackageManager = getPackageManager as jest.MockedFunction<
  typeof getPackageManager
>;
const mockGetInstallCommand = getInstallCommand as jest.MockedFunction<
  typeof getInstallCommand
>;

describe('checkDynamicVersions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return early if all packages are in sync', () => {
    // Arrange
    const packages = {
      '@dynamic-labs/sdk-react': '1.0.0',
      '@dynamic-labs/sdk-react-core': '1.0.0',
    };
    mockGetInstalledPackages.mockReturnValue(packages);

    // Act
    checkDynamicVersions();

    // Assert
    expect(DoctorLogger.warning).not.toHaveBeenCalled();
  });

  it('should log warning with correct packages and versions if packages are not in sync', () => {
    // Arrange
    const packages = {
      '@dynamic-labs/sdk-react': '1.0.0',
      '@dynamic-labs/sdk-react-core': '1.0.0',
      'other-package-1': '2.0.0',
      'other-package-2': '1.5.0',
    };
    mockGetInstalledPackages.mockReturnValue(packages);

    mockGetPackageManager.mockReturnValue({
      packageManager: 'npm',
      packageManagerVersion: '1.0.0',
    });

    mockGetInstallCommand.mockReturnValue('npm install');

    const expectedWarningMessage = `
The Following packages must use the same version as @dynamic-labs/sdk-react

Update the following
npm install other-package-1@1.0.0,other-package-2@1.0.0
  `;

    // Act
    checkDynamicVersions();

    // Assert
    expect(DoctorLogger.warning).toHaveBeenCalledWith(
      chalk.yellow(expectedWarningMessage),
    );
  });
});
