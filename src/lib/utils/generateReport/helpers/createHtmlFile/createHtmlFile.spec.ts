import path from 'path';
import { writeFile } from 'fs';

import { DoctorLogger } from '../../../loggers/DoctorLogger';

import { createHtmlFile } from './createHtmlFile';

jest.mock('path');
jest.mock('fs');
jest.mock('../../../loggers/DoctorLogger');

const mockedPath = path as jest.Mocked<typeof path>;
const mockedWriteFile = writeFile as jest.MockedFunction<typeof writeFile>;

describe('createHtmlFile', () => {
  const mockOutputFilePath = '/path/to/output.html';
  const mockHtml = '<html>Mock HTML</html>';

  beforeEach(() => {
    jest.clearAllMocks();
    mockedPath.resolve.mockReturnValue(mockOutputFilePath);
  });

  test('should create an HTML file and log success message', () => {
    createHtmlFile(mockHtml);

    expect(path.resolve).toHaveBeenCalledWith(
      process.cwd(),
      expect.any(String),
    );
    expect(writeFile).toHaveBeenCalledWith(
      mockOutputFilePath,
      mockHtml,
      expect.any(Function),
    );

    // Trigger the writeFile callback without an error to test the success branch
    mockedWriteFile.mock.calls[0][2](null);
    expect(DoctorLogger.success).toHaveBeenCalledWith(
      'Report file created successfully, please send it to us on our slack channel. Here is the path:',
      mockOutputFilePath,
    );
  });

  test('should log an error message if there is an error creating the HTML file', () => {
    createHtmlFile(mockHtml);

    expect(path.resolve).toHaveBeenCalledWith(
      process.cwd(),
      expect.any(String),
    );
    expect(writeFile).toHaveBeenCalledWith(
      mockOutputFilePath,
      mockHtml,
      expect.any(Function),
    );

    // Trigger the writeFile callback with a mock error to test the error branch
    const mockError = new Error('Mock error');
    mockedWriteFile.mock.calls[0][2](mockError);
    expect(DoctorLogger.error).toHaveBeenCalledWith('Error creating HTML file');
  });
});
