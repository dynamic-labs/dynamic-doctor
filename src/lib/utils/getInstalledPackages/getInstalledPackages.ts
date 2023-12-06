import { execSync } from 'child_process';
import { getPackageManager } from '../getPackageManager';

const getPositionInLine = (
  string: string,
  subString: string,
  index: number,
) => {
  return string.split(subString, index).join(subString).length;
};

const packageNamesWithDifferentVersion = [
  '@dynamic-labs/passport-dynamic',
  '@dynamic-labs/iconic',
  '@dynamic-labs/sdk-api',
];

const getCommand = (packageManager: string) => {
  if (packageManager === 'bun') {
    return 'bun pm ls';
  }

  if (packageManager === 'pnpm') {
    return 'pnpm ls';
  }

  return 'npm ls';
};

const getPnpmInstalledPackages = (command: string) => {
  return execSync(command)
    .toString()
    .split('\n')
    .map((i) => i.trim())
    .filter((i) => i !== '')
    .slice(3) //remove useless lines
    .reduce((dependencies, line) => {
      if (!line.includes('@dynamic-labs')) {
        return dependencies;
      }

      const [packageName, version] = line.split(' ');

      if (packageNamesWithDifferentVersion.includes(packageName)) {
        return dependencies;
      }

      return {
        ...dependencies,
        [packageName]: version,
      };
    }, {});
};

export const getInstalledPackages = (): any => {
  const packageManager = getPackageManager().packageManager;
  const command = getCommand(packageManager);

  if (packageManager === 'pnpm') {
    return getPnpmInstalledPackages(command);
  }

  return execSync(command)
    .toString()
    .split(/├──|└──|\+--|`--/)
    .slice(1)
    .map((i) => i.trim())
    .reduce((dependencies, line) => {
      if (!line.includes('@dynamic-labs')) {
        return dependencies;
      }

      const indexOfAt = getPositionInLine(line, '@', 2);

      const packageName = line.slice(0, indexOfAt);

      if (packageNamesWithDifferentVersion.includes(packageName)) {
        return dependencies;
      }

      const version = line.slice(indexOfAt + 1).split(' ')[0];

      return {
        ...dependencies,
        [packageName]: version,
      };
    }, {});
};
