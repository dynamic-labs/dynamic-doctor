import chalk from 'chalk';

import { getPackageManager } from '../getPackageManager';
import { DoctorLogger } from '../loggers/DoctorLogger';
import { getInstalledPackages } from '../getInstalledPackages';
import { getInstallCommand } from '../getInstallCommand';

const basePackages = [
  '@dynamic-labs/sdk-react',
  '@dynamic-labs/sdk-react-core',
];

export const checkDynamicVersions = (): void => {
  const packages = getInstalledPackages();

  const baseSdkReactVersion =
    packages['@dynamic-labs/sdk-react'] ||
    packages['@dynamic-labs/sdk-react-core'];

  const otherDynamicDependencies = Object.keys(packages).reduce(
    (result, packageName) => {
      if (basePackages.includes(packageName)) {
        return result;
      }

      return {
        ...result,
        [packageName]: packages[packageName],
      };
    },
    {},
  );

  const dynamicPackagesOutWithWrongVersion = Object.keys(
    otherDynamicDependencies,
  ).reduce((result, packageName) => {
    const packageVersion = packages[packageName];

    if (packageVersion !== baseSdkReactVersion) {
      return {
        ...result,
        [packageName]: packageVersion,
      };
    }

    return result;
  }, {});

  const isAllPackagesInSync =
    Object.keys(dynamicPackagesOutWithWrongVersion).length === 0;

  if (isAllPackagesInSync) {
    return;
  }

  const packageManager = getPackageManager();

  const installCommand = getInstallCommand(packageManager.packageManager);

  DoctorLogger.warning(
    chalk.yellow(`
The Following packages must use the same version as @dynamic-labs/sdk-react

Update the following
${installCommand} ${Object.keys(dynamicPackagesOutWithWrongVersion).map(
      (packageName) => [packageName, baseSdkReactVersion].join('@'),
    )}
  `),
  );
};
