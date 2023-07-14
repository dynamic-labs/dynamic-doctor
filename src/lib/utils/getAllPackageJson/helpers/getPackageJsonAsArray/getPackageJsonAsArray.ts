import { DoctorLogger } from '../../../loggers/DoctorLogger';

export type PackageJsonRow = {
  spaces: number;
  text: string;
};

const countSpaces = (line: string): number => {
  const match = line.match(/^(\s*)/);
  return match ? match[0].length : 0;
};

export const getPackageJsonAsArray = (packageJson: string): PackageJsonRow[] => {
  try {
    const formattedPackageJson = JSON.stringify(
      JSON.parse(packageJson),
      null,
      2,
    );

    return formattedPackageJson.split('\n').map((line) => {
      return {
        spaces: countSpaces(line),
        text: line.trim(),
      }
    });
  } catch (error) {
    DoctorLogger.error('Error reading package.json file');
    return [];
  }
};
