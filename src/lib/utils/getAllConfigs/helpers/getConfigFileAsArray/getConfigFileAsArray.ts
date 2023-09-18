import { DoctorLogger } from '../../../loggers/DoctorLogger';

export type ConfigFileRow = {
  spaces: number;
  text: string;
};

const spacesRegex = /^(\s*)/;

const countSpaces = (line: string): number => {
  const match = spacesRegex.exec(line);

  // We can ignore else as it should never happen
  return match ? match[0].length : /* istanbul ignore next */ 0;
};

export const getConfigFileAsArray = (
  configFile: string,
  path: string,
): ConfigFileRow[] => {
  try {
    // Remove all comments from the config file
    configFile = configFile.replace(
      /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
      (m, g) => (g ? '' : m),
    );

    const formattedConfigFile = JSON.stringify(JSON.parse(configFile), null, 2);

    return formattedConfigFile.split('\n').map((line) => {
      return {
        spaces: countSpaces(line),
        text: line.trim(),
      };
    });
  } catch (error) {
    DoctorLogger.error(`Error reading config file, path: ${path}.
Caught error: ${error}`);
    return [];
  }
};
