import { execSync } from 'child_process';

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

export const getInstalledPackages = (): any =>
  execSync('npm ls')
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
