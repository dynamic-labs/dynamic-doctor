import * as enquirer from 'enquirer';

import { checkDynamicVersions } from '../../utils/checkDynamicVersions';
import { checkForSdkUpdates } from '../../utils/checkForSdkUpdates';
import { generateReport } from '../../utils/generateReport';
import { getAllConfigs } from '../../utils/getAllConfigs';
import { getBasicData } from '../../utils/getBasicData';
import { isInProjectRoot } from '../../utils/isInProjectRoot';
import { DoctorLogger } from '../../utils/loggers/DoctorLogger';
import { IssueCollector } from '../../utils/issueCollector/IssueCollector';
import { checkForProhibitedPackages } from '../../utils/checkForProhibitedPackages';

import { startDynamicDoctor } from './startDynamicDoctor';

jest.mock('../../utils/checkDynamicVersions');
jest.mock('../../utils/checkForSdkUpdates');
jest.mock('../../utils/checkForProhibitedPackages');
jest.mock('../../utils/generateReport');
jest.mock('../../utils/getAllConfigs');
jest.mock('../../utils/getBasicData');
jest.mock('../../utils/isInProjectRoot');
jest.mock('../../utils/loggers/DoctorLogger');
jest.mock('../../utils/issueCollector/IssueCollector');
jest.mock('enquirer', () => ({
  prompt: jest.fn(),
}));

const mockIsInProjectRoot = isInProjectRoot as jest.MockedFunction<
  typeof isInProjectRoot
>;
const mockCheckDynamicVersions = checkDynamicVersions as jest.MockedFunction<
  typeof checkDynamicVersions
>;
const mockCheckForProhibitedPackages =
  checkForProhibitedPackages as jest.MockedFunction<
    typeof checkForProhibitedPackages
  >;
const mockCheckForSdkUpdates = checkForSdkUpdates as jest.MockedFunction<
  typeof checkForSdkUpdates
>;
const mockGenerateReport = generateReport as jest.MockedFunction<
  typeof generateReport
>;
const mockGetAllConfigs = getAllConfigs as jest.MockedFunction<
  typeof getAllConfigs
>;
const mockGetBasicData = getBasicData as jest.MockedFunction<
  typeof getBasicData
>;
const mockIssueCollector = IssueCollector as jest.Mock;

describe('startDynamicDoctor', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(enquirer, 'prompt').mockResolvedValue({
      confirm: true,
    });
  });

  it('should execute the function correctly in the project root directory', async () => {
    mockIsInProjectRoot.mockReturnValue(true);

    await startDynamicDoctor();

    expect(mockIsInProjectRoot).toHaveBeenCalled();
    expect(mockCheckDynamicVersions).toHaveBeenCalled();
    expect(mockCheckForProhibitedPackages).toHaveBeenCalled();
    expect(mockCheckForSdkUpdates).toHaveBeenCalled();
    expect(mockGetBasicData).toHaveBeenCalled();
    expect(mockGetAllConfigs).toHaveBeenCalled();
    expect(mockGenerateReport).toHaveBeenCalled();
    expect(DoctorLogger.error).not.toHaveBeenCalled();
  });

  it('should stop running if customer answer no', async () => {
    jest.spyOn(enquirer, 'prompt').mockResolvedValue({
      confirm: false,
    });

    await startDynamicDoctor();

    expect(mockIsInProjectRoot).not.toHaveBeenCalled();
    expect(DoctorLogger.info).toHaveBeenCalledWith('Aborting dynamic doctor.');
  });

  it('should print the issues if any were found', async () => {
    const printIssuesMock = jest.fn();

    const mockIssueCollectorInstance = {
      hasIssues: jest.fn(() => true),
      printIssues: printIssuesMock,
    };

    mockIssueCollector.mockReturnValueOnce(mockIssueCollectorInstance);

    mockIsInProjectRoot.mockReturnValue(true);

    await startDynamicDoctor();

    expect(printIssuesMock).toHaveBeenCalled();
  });

  it('should log an error message when not in the project root directory', async () => {
    mockIsInProjectRoot.mockReturnValue(false);

    await startDynamicDoctor();

    expect(DoctorLogger.error).toHaveBeenCalledWith(
      'You are not in a project root directory.\nA root directory must contain a package.json and package manager lock (supported: yarn, npm, pnpm).',
    );
    expect(mockIsInProjectRoot).toHaveBeenCalled();
    expect(mockCheckDynamicVersions).not.toHaveBeenCalled();
    expect(mockCheckForProhibitedPackages).not.toHaveBeenCalled();
    expect(mockCheckForSdkUpdates).not.toHaveBeenCalled();
    expect(mockGetBasicData).not.toHaveBeenCalled();
    expect(mockGetAllConfigs).not.toHaveBeenCalled();
    expect(mockGenerateReport).not.toHaveBeenCalled();
  });

  it('should show errors when customer wants and something throws', async () => {
    mockIsInProjectRoot.mockReturnValue(true);

    mockGetBasicData.mockImplementation(() => {
      throw new Error('Something went wrong');
    });

    await startDynamicDoctor();

    expect(DoctorLogger.error).toHaveBeenCalledWith(
      'An error occurred while running dynamic doctor.',
    );

    expect(DoctorLogger.info).toHaveBeenCalledWith(
      new Error('Something went wrong'),
    );
  });

  it('should not show errors when customer declines and something throws', async () => {
    jest
      .spyOn(enquirer, 'prompt')
      .mockResolvedValueOnce({
        confirm: true,
      })
      .mockResolvedValueOnce({
        confirm: false,
      });
    mockIsInProjectRoot.mockReturnValue(true);

    mockGetBasicData.mockImplementation(() => {
      throw new Error('Something went wrong');
    });

    await startDynamicDoctor();

    expect(DoctorLogger.error).toHaveBeenCalledWith(
      'An error occurred while running dynamic doctor.',
    );

    expect(DoctorLogger.info).not.toHaveBeenCalled();
  });
});
