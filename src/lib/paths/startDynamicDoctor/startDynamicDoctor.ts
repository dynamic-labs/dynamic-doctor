import { prompt } from 'enquirer';

import { checkDynamicVersions } from '../../utils/checkDynamicVersions';
import { checkForSdkUpdates } from '../../utils/checkForSdkUpdates';
import { generateReport } from '../../utils/generateReport';
import { getAllConfigs } from '../../utils/getAllConfigs';
import { getBasicData } from '../../utils/getBasicData';
import { isInProjectRoot } from '../../utils/isInProjectRoot';
import { DoctorLogger } from '../../utils/loggers/DoctorLogger';
import { IssueCollector } from '../../utils/issueCollector/IssueCollector';
import { getInstalledPackages } from '../../utils/getInstalledPackages';
import { checkForProhibitedPackages } from '../../utils/checkForProhibitedPackages';

export const startDynamicDoctor = async () => {
  const { confirm } = await prompt<{ confirm: boolean }>({
    type: 'confirm',
    name: 'confirm',
    message:
      'Please make sure you are running this command in the project root directory.\n  Continue?', // two spaces before 'Continue' to align with the 'Please'
  });

  if (!confirm) {
    DoctorLogger.newLine();
    DoctorLogger.info('Aborting dynamic doctor.');
    return;
  }

  if (isInProjectRoot()) {
    try {
      const issueCollector = new IssueCollector();

      DoctorLogger.dashedLine();
      const basicData = getBasicData();
      const packageJsons = getAllConfigs();

      checkForProhibitedPackages(issueCollector, packageJsons);

      const packages = getInstalledPackages();

      checkDynamicVersions(issueCollector, packages);
      await checkForSdkUpdates(issueCollector, packages);

      await generateReport(basicData, packageJsons, issueCollector.issues);

      if (issueCollector.hasIssues()) {
        issueCollector.printIssues();
      }
    } catch (error) {
      DoctorLogger.error('An error occurred while running dynamic doctor.');

      const { confirm: seeLogsConfirm } = await prompt<{ confirm: boolean }>({
        type: 'confirm',
        name: 'confirm',
        message: 'Do you want to see the logs?',
      });

      if (seeLogsConfirm) {
        DoctorLogger.info(error);
      }
    }
  } else {
    DoctorLogger.newLine();
    DoctorLogger.error(
      'You are not in a project root directory.\nA root directory must contain a package.json and package manager lock (supported: yarn, npm, pnpm).',
    );
  }
};
