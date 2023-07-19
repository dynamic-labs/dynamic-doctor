import { checkDynamicVersions } from '../../utils/checkDynamicVersions';
import { checkForSdkUpdates } from '../../utils/checkForSdkUpdates';
import { generateReport } from '../../utils/generateReport';
import { getAllConfigs } from '../../utils/getAllConfigs';
import { getBasicData } from '../../utils/getBasicData';
import { isInProjectRoot } from '../../utils/isInProjectRoot';
import { DoctorLogger } from '../../utils/loggers/DoctorLogger';

export const startDynamicDoctor = () => {
  DoctorLogger.info(
    'Please make sure you are running this command in the project root directory.',
  );

  if (isInProjectRoot()) {
    checkDynamicVersions();
    checkForSdkUpdates();
    const basicData = getBasicData();
    const packageJsons = getAllConfigs();

    generateReport(basicData, packageJsons);
  } else {
    DoctorLogger.error('You are not in a project root directory.');
    throw new Error('User is not in a project root directory.');
  }
};
