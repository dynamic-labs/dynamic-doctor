import { checkDynamicVersions } from '../../utils/checkDynamicVersions';
import { checkForSdkUpdates } from '../../utils/checkForSdkUpdates';
import { generateReport } from '../../utils/generateReport';
import { getAllConfigs } from '../../utils/getAllConfigs';
import { getBasicData } from '../../utils/getBasicData';
import { isInProjectRoot } from '../../utils/isInProjectRoot';
import { DoctorLogger } from '../../utils/loggers/DoctorLogger';
import { IssueCollector } from '../../utils/issueCollector/IssueCollector';

import { startDynamicDoctor } from './startDynamicDoctor';

jest.mock('../../utils/checkDynamicVersions');
jest.mock('../../utils/checkForSdkUpdates');
jest.mock('../../utils/generateReport');
jest.mock('../../utils/getAllConfigs');
jest.mock('../../utils/getBasicData');
jest.mock('../../utils/isInProjectRoot');
jest.mock('../../utils/loggers/DoctorLogger');
jest.mock('../../utils/issueCollector/IssueCollector');
jest.mock('enquirer', () => ({
  prompt: jest.fn().mockReturnValue({ confirm: true })
  })
);

const mockIsInProjectRoot = isInProjectRoot as jest.MockedFunction<
  typeof isInProjectRoot
>;
const mockCheckDynamicVersions = checkDynamicVersions as jest.MockedFunction<
  typeof checkDynamicVersions
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
  });

  it('should execute the function correctly in the project root directory', async () => {
    mockIsInProjectRoot.mockReturnValue(true);

    await startDynamicDoctor();

    expect(mockIsInProjectRoot).toHaveBeenCalled();
    expect(mockCheckDynamicVersions).toHaveBeenCalled();
    expect(mockCheckForSdkUpdates).toHaveBeenCalled();
    expect(mockGetBasicData).toHaveBeenCalled();
    expect(mockGetAllConfigs).toHaveBeenCalled();
    expect(mockGenerateReport).toHaveBeenCalled();
    expect(DoctorLogger.error).not.toHaveBeenCalled();
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

  it('should throw an error and log an error message when not in the project root directory', async () => {
    mockIsInProjectRoot.mockReturnValue(false);

    await expect(startDynamicDoctor()).rejects.toThrow(
      'User is not in a project root directory.',
    );
    
    expect(DoctorLogger.error).toHaveBeenCalledWith(
      'You are not in a project root directory.',
    );
    expect(mockIsInProjectRoot).toHaveBeenCalled();
    expect(mockCheckDynamicVersions).not.toHaveBeenCalled();
    expect(mockCheckForSdkUpdates).not.toHaveBeenCalled();
    expect(mockGetBasicData).not.toHaveBeenCalled();
    expect(mockGetAllConfigs).not.toHaveBeenCalled();
    expect(mockGenerateReport).not.toHaveBeenCalled();
  });
});
