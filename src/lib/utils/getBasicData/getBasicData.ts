import { getPackageManager } from '../getPackageManager';
import { getPlatform } from '../getPlatform';
import { getFramework } from '../getFramework';

export type BasicData = {
  framework: {
    name: string;
    version: string;
  };
  node: {
    name: 'node';
    version: string;
  };
  packageManager: {
    name: string;
    version: string;
  };
  platform: {
    name: string;
    version: string;
  };
};

export const getBasicData = (): BasicData => {
  const { framework, frameworkVersion } = getFramework();
  const { node, cpuArch, platform } = getPlatform();
  const { packageManager, packageManagerVersion } = getPackageManager();

  return {
    framework: {
      name: framework,
      version: frameworkVersion,
    },
    node: {
      name: 'node',
      version: node,
    },
    packageManager: {
      name: packageManager,
      version: packageManagerVersion,
    },
    platform: {
      name: platform,
      version: cpuArch,
    },
  };
};
