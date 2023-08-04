import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { isFileToFetch } from './helpers/isFileToFetch';

const pathsToIgnore = ['node_modules', 'dist', 'coverage', 'build', '.next'];

export const findConfigFilesPaths = (directory: string): string[] => {
  const configFilesPaths: string[] = [];

  const projectRoot = process.cwd();

  const traverseDirectory = (currentPath: string): void => {
    const files = readdirSync(currentPath);

    for (const file of files) {
      // Don't scan non-important paths
      if (!pathsToIgnore.includes(file)) {
        const filePath = join(currentPath, file);
        const fileStats = statSync(filePath);

        if (fileStats.isDirectory()) {
          traverseDirectory(filePath); // Recursively traverse subdirectories
        } else if (isFileToFetch(file)) {
          configFilesPaths.push(filePath.replace(projectRoot, '.'));
        }
      }
    }
  };

  traverseDirectory(directory);

  return configFilesPaths;
};
