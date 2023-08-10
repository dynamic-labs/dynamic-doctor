import path from 'path';
import { writeFile } from 'fs/promises';

import { DoctorLogger } from '../../../loggers/DoctorLogger';

export const createHtmlFile = async (html: string) => {
  try {
    const outputFilePath = path.resolve(
      process.cwd(),
      `dynamic-doctor-report-${new Date().getTime()}.html`,
    );
    
    await writeFile(outputFilePath, html);
    
    DoctorLogger.success(
      'Report file created successfully, please send it to us on our slack channel.\nHere is the path:',
      outputFilePath,
    );

    DoctorLogger.warning('*** Please make sure that there are no sensitive information in the file before sharing it ****')
  }
  catch (err) {
    DoctorLogger.error('Error creating HTML file');
  }
};
