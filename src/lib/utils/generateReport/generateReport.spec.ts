import path from 'path';

import pug from 'pug';

import { BasicData } from '../getBasicData';

import { generateReport } from './generateReport';
import { formatBasicData } from './helpers/formatBasicData';
import { createHtmlFile } from './helpers/createHtmlFile';
import { PackageJson } from '../getAllPackageJson';

jest.mock('path');
jest.mock('pug');
jest.mock('./helpers/formatBasicData');
jest.mock('./helpers/createHtmlFile');

const mockPath = path as jest.Mocked<typeof path>;
const mockPug = pug as jest.Mocked<typeof pug>;
const mockFormatBasicData = formatBasicData as jest.MockedFunction<
  typeof formatBasicData
>;

describe('generateReport', () => {
  it('should generate report correctly', () => {
    const basicData: BasicData = {
      framework: {
        name: 'react',
        version: '18',
      },
      node: {
        name: 'node',
        version: '18.0.0',
      },
      packageManager: {
        name: 'npm',
        version: '7.0.0',
      },
      platform: {
        name: 'darwin',
        version: 'x64',
      },
    };

    const packageJsons: PackageJson[] = [];

    const mockTemplatePath = '/path/to/report.pug';
    mockPath.resolve.mockReturnValue(mockTemplatePath);

    const mockCompiledFile = jest.fn();
    mockPug.compileFile.mockReturnValue(mockCompiledFile);

    const mockFormattedBasicData = formatBasicData(basicData);
    mockFormatBasicData.mockReturnValue(mockFormattedBasicData);

    const mockHtml = '<html>Mock HTML</html>';
    mockCompiledFile.mockReturnValue(mockHtml);

    generateReport(basicData, packageJsons);

    expect(mockPath.resolve).toHaveBeenCalledWith(
      expect.any(String),
      '../../../templates/report.pug',
    );
    expect(mockPug.compileFile).toHaveBeenCalledWith(mockTemplatePath);
    expect(mockFormatBasicData).toHaveBeenCalledWith(basicData);
    expect(mockCompiledFile).toHaveBeenCalledWith({
      basicData: mockFormattedBasicData,
      packageJsons,
    });
    expect(createHtmlFile).toHaveBeenCalledWith(mockHtml);
  });
});
