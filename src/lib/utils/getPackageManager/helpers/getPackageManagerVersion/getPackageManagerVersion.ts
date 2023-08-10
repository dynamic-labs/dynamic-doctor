import { execSync } from 'child_process';

export const getPackageManagerVersion = (packageManager: string) => {
  try {
    return execSync(`${packageManager} -v`).toString().trim();
  } catch (error) {
    return 'unknown';
  }
};
