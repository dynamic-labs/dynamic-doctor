import { readFileSync } from 'fs';

import { findPackageJsonPaths } from '../findPackageJsonPaths';

import { PackageJsonRow, getPackageJsonAsArray } from './helpers/getPackageJsonAsArray';

export type PackageJson = {
  packageJson: PackageJsonRow[];
  path: string;
};

export const getAllPackageJson = (): PackageJson[] => {
  const currentPath = process.cwd();
  const packageJsonPaths = findPackageJsonPaths(currentPath);
  return packageJsonPaths.map((packageJsonPath) => {
    const packageJson = readFileSync(packageJsonPath, 'utf8');

    return {
      packageJson: getPackageJsonAsArray(packageJson),
      path: packageJsonPath,
    };
  });
};
