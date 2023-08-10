import path from 'path';
import { writeFile } from 'fs';

import { DoctorLogger } from '../../../loggers/DoctorLogger';

export const createHtmlFile = (html: string) => {
  const outputFilePath = path.resolve(
    process.cwd(),
    `dynamic-doctor-report-${new Date().getTime()}.html`,
  );

  writeFile(outputFilePath, html, (err) => {
    if (err) {
      DoctorLogger.error('Error creating HTML file');
    } else {
      DoctorLogger.success(
        'Report file created successfully, please send it to us on our slack channel.\nHere is the path:',
        outputFilePath,
      );

      DoctorLogger.warning('*** Please make sure that there are no sensitive information in the file before sharing it ****')
    }
  });
};
