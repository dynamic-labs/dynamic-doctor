const filesToFetch = [
  {
    name: 'package.json',
    type: 'file',
  },
  {
    name: 'tsconfig',
    type: 'pattern',
    regex: /tsconfig(\..*)?\.json/,
  },
  {
    name: 'jsconfig',
    type: 'pattern',
    regex: /jsconfig(\..*)?\.json/,
  },
];

export const isFileToFetch = (file: string): boolean => {
  return filesToFetch.some((fileToFetch) => {
    if (fileToFetch.type === 'pattern' && fileToFetch.regex) {
      return fileToFetch.regex.test(file);
    }

    return fileToFetch.name === file;
  });
};
