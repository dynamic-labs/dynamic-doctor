import { ConfigFile } from '../getAllConfigs';
import { IssueCollector } from '../issueCollector/IssueCollector';
import { ConfigFileRow } from '../getAllConfigs/helpers/getConfigFileAsArray';

const listOfProhibitedPackages = [
  '@blocto/sdk',
  '@coinbase/wallet-sdk',
  '@keplr-wallet/provider',
  '@keplr-wallet/types',
  '@magic-ext/oauth',
  '@onflow/fcl',
  '@randlabs/myalgo-connect',
  '@wagmi/core',
  'wagmi',
  '@walletconnect/client',
  '@walletconnect/ethereum-provider',
  '@walletconnect/universal-provider',
  '@walletconnect/utils',
  'get-starknet-core',
  'magic-sdk',
  'starknet',
];

const packageJsonRegex = /package\.json$/;

type ProhibitedDependencies = {
  path: string;
  prohibitedDependencies: string[];
};

export const checkForProhibitedPackages = (
  issueCollector: IssueCollector,
  packageJsons: ConfigFile[],
): void => {
  const prohibitedDependencies: ProhibitedDependencies[] = [];
  packageJsons.forEach((packageJson) => {
    const packageJsonPath = packageJson.path;
    const packageJsonContent = packageJson.configFile;

    const isPackageJson = packageJsonRegex.test(packageJsonPath);

    if (!isPackageJson) {
      return;
    }

    prohibitedDependencies.push({
      path: packageJsonPath,
      prohibitedDependencies:
        getProhibitedDependenciesFromPackageJson(packageJsonContent),
    });
  });

  prohibitedDependencies.forEach((prohibitedDependency) => {
    const { path, prohibitedDependencies } = prohibitedDependency;
    if (prohibitedDependencies.length > 0) {
      issueCollector.addIssue({
        type: 'error',
        message: `You have the following prohibited dependencies in ${path}: ${prohibitedDependencies.join(
          ', ',
        )}`,
      });
    }
  });
};

const getProhibitedDependenciesFromPackageJson = (
  configFileRows: ConfigFileRow[],
) => {
  return configFileRows.reduce((result: string[], configFileRow) => {
    const packageName = configFileRow.text.split('"')[1];
    if (listOfProhibitedPackages.includes(packageName)) {
      result.push(packageName);
    }
    return result;
  }, []);
};
