import { execSync } from 'child_process';

import { DoctorLogger } from '../../../loggers/DoctorLogger';

export const getPackageManagerVersion = (packageManager: string) => {
  try {
    return execSync(`${packageManager} -v`).toString().trim();
  } catch (error) {
    DoctorLogger.error(`Error getting ${packageManager} version:`, error);
    return 'unknown';
  }
};
