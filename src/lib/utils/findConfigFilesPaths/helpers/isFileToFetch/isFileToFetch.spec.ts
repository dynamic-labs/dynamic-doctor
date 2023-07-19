import { isFileToFetch } from './isFileToFetch';

describe('isFileToFetch', () => {
  it('should return true when the file is in the list of files to fetch', () => {
    expect(isFileToFetch('package.json')).toBe(true);
    expect(isFileToFetch('tsconfig.json')).toBe(true);
    expect(isFileToFetch('tsconfig.prod.json')).toBe(true);
    expect(isFileToFetch('jsconfig.json')).toBe(true);
    expect(isFileToFetch('jsconfig.prod.json')).toBe(true);

    expect(isFileToFetch('index.html')).toBe(false);
  });
});
