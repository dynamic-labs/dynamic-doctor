import { execSync } from 'child_process';

export const getInstalledPackages = (): any =>
  execSync('npm ls')
    .toString()
    .split(/├──|└──|\+--|`--/)
    .slice(1)
    .map((i) => i.trim())
    .reduce((dependencies, line) => {
      const atIndex = line.lastIndexOf('@');

      const packageName = line.slice(0, atIndex);
      const version = line.slice(atIndex + 1);

      if (
        !packageName.startsWith('@dynamic-labs/') ||
        packageName === '@dynamic-labs/passport-dynamic'
      ) {
        return dependencies;
      }
      return {
        ...dependencies,
        [packageName]: version,
      };
    }, {});
