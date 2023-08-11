export const extractPackageJsonPaths = (configFilePaths: string[]) =>
  configFilePaths.filter((filePath) => filePath.endsWith('package.json'));
