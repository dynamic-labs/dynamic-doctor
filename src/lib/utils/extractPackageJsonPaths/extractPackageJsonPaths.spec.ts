import { extractPackageJsonPaths } from './extractPackageJsonPaths'; // Replace with the correct path

describe('extractPackageJsonPaths', () => {
  it('should return an empty array if input array is empty', () => {
    const input: string[] = [];
    const result = extractPackageJsonPaths(input);
    expect(result).toEqual([]);
  });

  it('should return an empty array if there are no package.json paths in the input', () => {
    const input: string[] = ['/path/to/file/config.yaml', '/path/to/another/config.json'];
    const result = extractPackageJsonPaths(input);
    expect(result).toEqual([]);
  });

  it('should return an array with the same package.json paths as input', () => {
    const input: string[] = [
      '/path/to/package.json',
      '/path/to/file/config.yaml',
      '/path/to/package.json',
      '/path/to/another/config.json',
      '/path/to/package.json',
    ];
    const result = extractPackageJsonPaths(input);
    const expectedOutput: string[] = ['/path/to/package.json', '/path/to/package.json', '/path/to/package.json'];
    expect(result).toEqual(expectedOutput);
  });
});
