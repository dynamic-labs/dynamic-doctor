import { existsSync } from 'fs';
import { join } from 'path';

export const isInProjectRoot = () => {
  const directory = process.cwd();

  const packageJsonPath = join(directory, 'package.json');
  const nodeModulesPath = join(directory, 'node_modules');
  const yarnLockPath = join(directory, 'yarn.lock');
  const packageLockPath = join(directory, 'package-lock.json');

  const isNodeModulesInDirectory = existsSync(nodeModulesPath);
  const isPackageJsonInDirectory = existsSync(packageJsonPath);
  const isYarnLockInDirectory = existsSync(yarnLockPath);
  const isPackageLockInDirectory = existsSync(packageLockPath);

  return (
    isNodeModulesInDirectory &&
    isPackageJsonInDirectory &&
    (isYarnLockInDirectory || isPackageLockInDirectory)
  );
};
