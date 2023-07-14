import { checkDynamicVersions } from '../../utils/checkDynamicVersions';
import { checkForSdkUpdates } from '../../utils/checkForSdkUpdates';
import { generateReport } from '../../utils/generateReport';
import { getAllPackageJson } from '../../utils/getAllPackageJson';
import { getBasicData } from '../../utils/getBasicData';
import { isInProjectRoot } from '../../utils/isInProjectRoot';
import { DoctorLogger } from '../../utils/loggers/DoctorLogger';

import { startDynamicDoctor } from './startDynamicDoctor';

jest.mock('../../utils/checkDynamicVersions');
jest.mock('../../utils/checkForSdkUpdates');
jest.mock('../../utils/generateReport');
jest.mock('../../utils/getAllPackageJson');
jest.mock('../../utils/getBasicData');
jest.mock('../../utils/isInProjectRoot');
jest.mock('../../utils/loggers/DoctorLogger');

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
const mockGetAllPackageJson = getAllPackageJson as jest.MockedFunction<
  typeof getAllPackageJson
>;
const mockGetBasicData = getBasicData as jest.MockedFunction<
  typeof getBasicData
>;

describe('startDynamicDoctor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute the function correctly in the project root directory', () => {
    mockIsInProjectRoot.mockReturnValue(true);

    startDynamicDoctor();

    expect(DoctorLogger.info).toHaveBeenCalledWith(
      'Please make sure you are running this command in the project root directory.',
    );
    expect(mockIsInProjectRoot).toHaveBeenCalled();
    expect(mockCheckDynamicVersions).toHaveBeenCalled();
    expect(mockCheckForSdkUpdates).toHaveBeenCalled();
    expect(mockGetBasicData).toHaveBeenCalled();
    expect(mockGetAllPackageJson).toHaveBeenCalled();
    expect(mockGenerateReport).toHaveBeenCalled();
    expect(DoctorLogger.error).not.toHaveBeenCalled();
  });

  it('should throw an error and log an error message when not in the project root directory', () => {
    mockIsInProjectRoot.mockReturnValue(false);

    expect(startDynamicDoctor).toThrow(
      'User is not in a project root directory.',
    );

    expect(DoctorLogger.error).toHaveBeenCalledWith(
      'You are not in a project root directory.',
    );
    expect(mockIsInProjectRoot).toHaveBeenCalled();
    expect(mockCheckDynamicVersions).not.toHaveBeenCalled();
    expect(mockCheckForSdkUpdates).not.toHaveBeenCalled();
    expect(mockGetBasicData).not.toHaveBeenCalled();
    expect(mockGetAllPackageJson).not.toHaveBeenCalled();
    expect(mockGenerateReport).not.toHaveBeenCalled();
  });
});
