import { getPackageManager } from '../getPackageManager';
import { getInstallCommand } from '../getInstallCommand';
import { IssueCollector } from '../issueCollector/IssueCollector';

const basePackages = [
  '@dynamic-labs/sdk-react',
  '@dynamic-labs/sdk-react-core',
];

export const checkDynamicVersions = (
  issueCollector: IssueCollector,
  packages: any,
): void => {
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

  issueCollector.addIssue({
    type: 'error',
    message: `The Following packages must use the same version as @dynamic-labs/sdk-react.\nUpdate the following
${installCommand} ${Object.keys(dynamicPackagesOutWithWrongVersion).map(
      (packageName) => [packageName, baseSdkReactVersion].join('@'),
    )}`,
  });
};
