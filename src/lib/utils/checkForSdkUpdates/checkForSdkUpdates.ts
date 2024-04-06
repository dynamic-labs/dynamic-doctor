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

const fetchLatestAlphaVersion = async (packageName: string) => {
  const response = await fetch(`https://registry.npmjs.org/${packageName}`);
  const json: any = await response.json();
  return json['dist-tags'].alpha;
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
  const packageManager = getPackageManager();
  const installCommand = getInstallCommand(packageManager.packageManager);

  const latestVersion = await fetchLatestVersion(whichSdk);

  if (baseSdkReactVersion.includes('alpha')) {
    const latestAlphaVersion = await fetchLatestAlphaVersion(whichSdk);

    const latestVersionMajor = latestVersion.split('.')[0];
    const baseSdkReactVersionMajor = baseSdkReactVersion.split('.')[0];

    if (
      baseSdkReactVersionMajor === latestVersionMajor ||
      parseInt(baseSdkReactVersionMajor, 10) < parseInt(latestVersionMajor, 10)
    ) {
      issueCollector.addIssue({
        type: 'warning',
        message: `Your Dynamic SDK is an outdated alpha version.\nWe already released a stable version which contains all of the alpha features: ${latestVersion}.\nCheck out our docs and try our latest using your package manager: ${installCommand} ${whichSdk}@latest.`,
      });
      return;
    }

    if (baseSdkReactVersion === latestAlphaVersion) {
      DoctorLogger.success(
        `Your Dynamic SDK is up to date with our latest alpha: ${baseSdkReactVersion}`,
      );
      return;
    }

    issueCollector.addIssue({
      type: 'warning',
      message: `Your Dynamic SDK is out of date: ${baseSdkReactVersion}.\nLatest alpha version is ${latestAlphaVersion}.\nCheck out our docs and try our latest using your package manager: ${installCommand} ${whichSdk}@alpha.\nIf you don't need alpha features we recommend using the latest stable version: ${installCommand} ${whichSdk}@latest. Please make sure to apply the version to all of Dynamic packages.`,
    });

    return;
  }

  if (baseSdkReactVersion === latestVersion) {
    DoctorLogger.success(
      `Your Dynamic SDK is up to date: ${baseSdkReactVersion}`,
    );
    return;
  }

  issueCollector.addIssue({
    type: 'warning',
    message: `Your Dynamic SDK is out of date: ${baseSdkReactVersion}.\nLatest version is ${latestVersion}.\nCheck out our docs and try our latest using your package manager: ${installCommand} ${whichSdk}@latest`,
  });
};
