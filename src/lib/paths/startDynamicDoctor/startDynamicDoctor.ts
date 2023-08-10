import { prompt } from 'enquirer';

import { checkDynamicVersions } from '../../utils/checkDynamicVersions';
import { checkForSdkUpdates } from '../../utils/checkForSdkUpdates';
import { generateReport } from '../../utils/generateReport';
import { getAllConfigs } from '../../utils/getAllConfigs';
import { getBasicData } from '../../utils/getBasicData';
import { isInProjectRoot } from '../../utils/isInProjectRoot';
import { DoctorLogger } from '../../utils/loggers/DoctorLogger';

export const startDynamicDoctor = async () => {
  const { confirm } = await prompt<{ confirm: boolean }>({
    type: 'confirm',
    name: 'confirm',
    message: 'Please make sure you are running this command in the project root directory.\nContinue?',
  });

  if (!confirm) {
    DoctorLogger.info('Aborting dynamic doctor.');
    return;
  }


  if (isInProjectRoot()) {
    DoctorLogger.dashedLine();
    
    checkDynamicVersions();
    await checkForSdkUpdates();

    const basicData = getBasicData();
    const packageJsons = getAllConfigs();

    generateReport(basicData, packageJsons);
  } else {
    DoctorLogger.error('You are not in a project root directory.');
    throw new Error('User is not in a project root directory.');
  }
};
