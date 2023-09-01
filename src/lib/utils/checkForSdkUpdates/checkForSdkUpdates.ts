import fetch from 'node-fetch';
import { getInstallCommand } from '../getInstallCommand';
import { getPackageManager } from '../getPackageManager';
import { DoctorLogger } from '../loggers/DoctorLogger';
import { sdkVsSdkCoreDocsUrl } from '../../static/urls';
import { IssueCollector } from '../issueCollector/IssueCollector';

const fetchLatestVersion = async (packageName: string) => {
  const response = await fetch(`https://registry.npmjs.org/${packageName}`);
  const json: any = await response.json();
  return json['dist-tags'].latest;
};

const checkWhichSdkIsUsed = (packages: any) => {
  if (packages['@dynamic-labs/sdk-react']) {
    return '@dynamic-labs/sdk-react';
  }
  if (packages['@dynamic-labs/sdk-react-core']) {
    return '@dynamic-labs/sdk-react-core';
  }
  return null;
};

const isSdkDuplicated = (packages: any) => {
  return !!(
    packages['@dynamic-labs/sdk-react'] &&
    packages['@dynamic-labs/sdk-react-core']
  );
};

export const checkForSdkUpdates = async (
  issueCollector: IssueCollector,
  packages: any,
) => {
  if (isSdkDuplicated(packages)) {
    issueCollector.addIssue({
      type: 'error',
      message: `You have both @dynamic-labs/sdk-react and @dynamic-labs/sdk-react-core installed. Please remove one of them. Check the difference here: ${sdkVsSdkCoreDocsUrl}`,
    });
    return;
  }

  const whichSdk = checkWhichSdkIsUsed(packages);
  if (!whichSdk) {
    issueCollector.addIssue({
      type: 'error',
      message: `No Dynamic SDK found in package.json. We can't check for updates.`,
    });
    return;
  }

  const baseSdkReactVersion = packages[whichSdk];

  const latestVersion = await fetchLatestVersion(whichSdk);

  if (baseSdkReactVersion === latestVersion) {
    DoctorLogger.success(
      `Your Dynamic SDK is up to date: ${baseSdkReactVersion}`,
    );
    return;
  }

  const packageManager = getPackageManager();
  const installCommand = getInstallCommand(packageManager.packageManager);
  issueCollector.addIssue({
    type: 'warning',
    message: `Your Dynamic SDK is out of date: ${baseSdkReactVersion}.\nLatest version is ${latestVersion}.\nCheck out our docs and try our latest using your package manager: ${installCommand} ${whichSdk}@latest`,
  });
};
