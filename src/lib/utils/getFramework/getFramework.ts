import fs from 'fs';

import { findPackageJsonPaths } from '../findPackageJsonPaths';

const getFrameworkFromPackageJsonDependencies = (
  packageJsonDependencies: Record<string, string>,
) => {
  if (packageJsonDependencies['astro']) {
    return 'astro';
  }
  if (packageJsonDependencies['next']) {
    return 'next';
  }
  if (packageJsonDependencies['react']) {
    return 'react';
  }
  return 'unknown';
};

export const getFramework = () => {
  const allPackageJsonPaths = findPackageJsonPaths(process.cwd());
  const parsedPackageJsons = allPackageJsonPaths.map((path) => {
    const file = fs.readFileSync(path, 'utf8');
    return JSON.parse(file);
  });

  const frameworkData = {
    framework: 'unknown',
    frameworkVersion: 'unknown',
  };

  parsedPackageJsons.forEach((packageJson) => {
    if (packageJson.dependencies) {
      const framework = getFrameworkFromPackageJsonDependencies(
        packageJson.dependencies,
      );

      const frameworkVersion = packageJson.dependencies[framework];

      if (framework !== 'unknown') {
        frameworkData.framework = framework;
        frameworkData.frameworkVersion = frameworkVersion;
        return;
      }
    }
  });

  return frameworkData;
};
