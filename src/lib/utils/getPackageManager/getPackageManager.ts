import { existsSync } from 'fs';

import { getPackageManagerVersion } from './helpers/getPackageManagerVersion';
const NPM_LOCK_PATH = './package-lock.json';
const YARN_LOCK_PATH = './yarn.lock';
const PNPM_LOCK_PATH = './pnpm-lock.yaml';

const getPackageManagerFromPaths = () => {
  if (existsSync(NPM_LOCK_PATH)) {
    return 'npm';
  } else if (existsSync(YARN_LOCK_PATH)) {
    return 'yarn';
  } else if (existsSync(PNPM_LOCK_PATH)) {
    return 'pnpm';
  }
  return 'unknown';
};

export const getPackageManager = () => {
  const packageManager = getPackageManagerFromPaths();

  const packageManagerVersion = getPackageManagerVersion(packageManager);

  return {
    packageManager,
    packageManagerVersion,
  };
};
