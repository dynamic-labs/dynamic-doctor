import { readFileSync } from 'fs';

import { findConfigFilesPaths } from '../findConfigFilesPaths';

import { ConfigFileRow, getConfigFileAsArray } from './helpers/getConfigFileAsArray';

export type ConfigFile = {
  configFile: ConfigFileRow[];
  path: string;
};

export const getAllConfigs = (): ConfigFile[] => {
  const currentPath = process.cwd();
  const configFilesPaths = findConfigFilesPaths(currentPath);
  return configFilesPaths.map((configFilePath) => {
    const configFile = readFileSync(configFilePath, 'utf8');

    return {
      configFile: getConfigFileAsArray(configFile, configFilePath),
      path: configFilePath,
    };
  });
};
