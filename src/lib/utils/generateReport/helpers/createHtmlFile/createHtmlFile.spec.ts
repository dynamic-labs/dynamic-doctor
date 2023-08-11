import path from 'path';
import { writeFile } from 'fs/promises';

import { DoctorLogger } from '../../../loggers/DoctorLogger';

import { createHtmlFile } from './createHtmlFile';

jest.mock('path');
jest.mock('fs/promises');
jest.mock('../../../loggers/DoctorLogger');

const mockedPath = path as jest.Mocked<typeof path>;
const mockedWriteFile = writeFile as jest.Mock;

describe('createHtmlFile', () => {
  const mockOutputFilePath = '/path/to/output.html';
  const mockHtml = '<html>Mock HTML</html>';

  beforeEach(() => {
    jest.clearAllMocks();
    mockedPath.resolve.mockReturnValue(mockOutputFilePath);
  });

  it('should create an HTML file and log success message', async () => {
    await createHtmlFile(mockHtml);

    expect(path.resolve).toHaveBeenCalledWith(
      process.cwd(),
      expect.any(String),
    );
    expect(mockedWriteFile).toHaveBeenCalledWith(mockOutputFilePath, mockHtml);

    expect(DoctorLogger.success).toHaveBeenCalledWith(
      'Report file created successfully, please send it to us on our slack channel.\nHere is the path:',
      mockOutputFilePath,
    );
  });

  it('should log an error message if there is an error creating the HTML file', async () => {
    mockedWriteFile.mockImplementation(() => {
      throw new Error('Mock error');
    });

    await createHtmlFile(mockHtml);

    expect(path.resolve).toHaveBeenCalledWith(
      process.cwd(),
      expect.any(String),
    );

    expect(mockedWriteFile).toHaveBeenCalledWith(mockOutputFilePath, mockHtml);

    expect(DoctorLogger.error).toHaveBeenCalledWith('Error creating HTML file');
  });
});
