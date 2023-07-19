import fs from 'fs';

import { findConfigFilesPaths } from '../findConfigFilesPaths';
import { extractPackageJsonPaths } from '../extractPackageJsonPaths';

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
  const allConfigFilePaths = findConfigFilesPaths(process.cwd());
  const allPackageJsonPaths = extractPackageJsonPaths(allConfigFilePaths);
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
