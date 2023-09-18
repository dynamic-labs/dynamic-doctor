import { DoctorLogger } from '../../../loggers/DoctorLogger';

import { getConfigFileAsArray } from './getConfigFileAsArray';

jest.mock('../../../loggers/DoctorLogger');

describe('getConfigFileAsArray', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should format and split package.json correctly', () => {
    const mockPackageJson = `{
      "name": "example-package",
      "version": "1.0.0",
      "description": "Example package.json",
      "dependencies": {
        "test1": "^4.17.1",
        "test2": "^4.17.21"
      },
      "devDependencies": {
        "test3": "^27.0.6"
      }
    }`;

    const result = getConfigFileAsArray(mockPackageJson, 'package.json');

    expect(result).toEqual([
      { spaces: 0, text: '{' },
      { spaces: 2, text: '"name": "example-package",' },
      { spaces: 2, text: '"version": "1.0.0",' },
      { spaces: 2, text: '"description": "Example package.json",' },
      { spaces: 2, text: '"dependencies": {' },
      { spaces: 4, text: '"test1": "^4.17.1",' },
      { spaces: 4, text: '"test2": "^4.17.21"' },
      { spaces: 2, text: '},' },
      { spaces: 2, text: '"devDependencies": {' },
      { spaces: 4, text: '"test3": "^27.0.6"' },
      { spaces: 2, text: '}' },
      { spaces: 0, text: '}' },
    ]);

    expect(DoctorLogger.error).not.toHaveBeenCalled();
  });

  it('should handle an empty package.json', () => {
    const mockPackageJson = '{}';

    const result = getConfigFileAsArray(mockPackageJson, 'package.json');

    expect(result).toEqual([{ spaces: 0, text: '{}' }]);

    expect(DoctorLogger.error).not.toHaveBeenCalled();
  });

  it('should handle an lines without spaces', () => {
    const mockPackageJson = `{
"name": "example-package",
      "version": "1.0.0"
    }`;

    const result = getConfigFileAsArray(mockPackageJson, 'package.json');

    expect(result).toEqual([
      { spaces: 0, text: '{' },
      { spaces: 2, text: '"name": "example-package",' },
      { spaces: 2, text: '"version": "1.0.0"' },
      { spaces: 0, text: '}' },
    ]);

    expect(DoctorLogger.error).not.toHaveBeenCalled();
  });

  it('should remove all comments from config files', () => {
    const mockPackageJson = `{
      "test1": "test", // Single line comment
      "test2": "test", /* Multi
      line
      comment */
      "other": "1.0.0"
    }`;

    const result = getConfigFileAsArray(mockPackageJson, 'package.json');

    expect(result).toEqual([
      { spaces: 0, text: '{' },
      { spaces: 2, text: '"test1": "test",' },
      { spaces: 2, text: '"test2": "test",' },
      { spaces: 2, text: '"other": "1.0.0"' },
      { spaces: 0, text: '}' },
    ]);

    expect(DoctorLogger.error).not.toHaveBeenCalled();
  });

  it('should handle parsing error and log an error message', () => {
    const mockPackageJson =
      '{ "name": "example-package", "version": "1.0.0", }';

    const result = getConfigFileAsArray(mockPackageJson, 'package.json');

    expect(result).toEqual([]);

    expect(DoctorLogger.error).toHaveBeenCalledWith(
      'Error reading config file, path: package.json.\nCaught error: SyntaxError: Unexpected token } in JSON at position 49',
    );
  });
});
