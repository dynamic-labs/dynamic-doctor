import { DoctorLogger } from '../../../loggers/DoctorLogger';

export type ConfigFileRow = {
  spaces: number;
  text: string;
};

const countSpaces = (line: string): number => {
  const match = line.match(/^(\s*)/);
  return match ? match[0].length : 0;
};

export const getConfigFileAsArray = (configFile: string, path: string): ConfigFileRow[] => {
  try {
    const formattedConfigFile = JSON.stringify(
      JSON.parse(configFile),
      null,
      2,
    );

    return formattedConfigFile.split('\n').map((line) => {
      return {
        spaces: countSpaces(line),
        text: line.trim(),
      }
    });
  } catch (error) {
    DoctorLogger.error(`Error reading config file, path: ${path}.
Caught error: ${error}`);
    return [];
  }
};
