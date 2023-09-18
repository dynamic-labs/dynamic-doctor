import { existsSync } from 'fs';

import { getPackageManagerVersion } from './helpers/getPackageManagerVersion';
const NPM_LOCK_PATH = './package-lock.json';
const YARN_LOCK_PATH = './yarn.lock';
const PNPM_LOCK_PATH = './pnpm-lock.yaml';
const BUN_LOCK_PATH = './bun.lockb';

const getPackageManagerFromPaths = () => {
  if (existsSync(NPM_LOCK_PATH)) {
    return 'npm';
  }

  if (existsSync(YARN_LOCK_PATH)) {
    return 'yarn';
  }

  if (existsSync(PNPM_LOCK_PATH)) {
    return 'pnpm';
  }

  if (existsSync(BUN_LOCK_PATH)) {
    return 'bun';
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
