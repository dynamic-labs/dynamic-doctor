import { getPackageManager } from '../getPackageManager';
import { getInstalledPackages } from '../getInstalledPackages';
import { getInstallCommand } from '../getInstallCommand';
import { IssueCollector } from '../issueCollector/IssueCollector';

import { checkDynamicVersions } from './checkDynamicVersions';

jest.mock('../getPackageManager');
jest.mock('../getInstalledPackages');
jest.mock('../getInstallCommand');
jest.mock('../issueCollector/IssueCollector');

const mockGetInstalledPackages = getInstalledPackages as jest.MockedFunction<
  typeof getInstalledPackages
>;
const mockGetPackageManager = getPackageManager as jest.MockedFunction<
  typeof getPackageManager
>;
const mockGetInstallCommand = getInstallCommand as jest.MockedFunction<
  typeof getInstallCommand
>;

const issueCollector = new IssueCollector();

describe('checkDynamicVersions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return early if all packages are in sync', () => {
    const packages = {
      '@dynamic-labs/sdk-react': '1.0.0',
      '@dynamic-labs/sdk-react-core': '1.0.0',
    };
    mockGetInstalledPackages.mockReturnValue(packages);

    checkDynamicVersions(issueCollector);

    expect(issueCollector.addIssue).not.toHaveBeenCalled();
  });

  it('should log warning with correct packages and versions if packages are not in sync', () => {
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

    const expectedWarningMessage = `The Following packages must use the same version as @dynamic-labs/sdk-react.\nUpdate the following
npm install other-package-1@1.0.0,other-package-2@1.0.0`;

    checkDynamicVersions(issueCollector);

    expect(issueCollector.addIssue).toHaveBeenCalledWith({
      type: 'error',
      message: expectedWarningMessage,
    });
  });
});
