import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const pathsToIgnore = ['node_modules', 'dist', 'coverage', 'build'];

export const findPackageJsonPaths = (directory: string): string[] => {
  const packageJsonPaths: string[] = [];

  const traverseDirectory = (currentPath: string): void => {
    const files = readdirSync(currentPath);

    for (const file of files) {
      // Don't scan non-important paths
      if (!pathsToIgnore.includes(file)) {
        const filePath = join(currentPath, file);
        const fileStats = statSync(filePath);

        if (fileStats.isDirectory()) {
          traverseDirectory(filePath); // Recursively traverse subdirectories
        } else if (file === 'package.json') {
          packageJsonPaths.push(filePath);
        }
      }
    }
  };

  traverseDirectory(directory);

  return packageJsonPaths;
};
