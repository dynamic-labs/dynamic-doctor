import chalk from 'chalk';

import { DoctorLogger } from './DoctorLogger';

jest.spyOn(console, 'log');
jest.spyOn(console, 'error');

describe('DoctorLogger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log the message correctly', () => {
    const mockMessage = 'Log message';

    DoctorLogger.log(mockMessage);

    expect(console.log).toHaveBeenCalledWith(
      chalk.bgYellowBright.black('[DynamicDoctor - Log]'),
      mockMessage,
      '\n',
    );
  });

  it('should log the info message correctly', () => {
    const mockMessage = 'Info message';

    DoctorLogger.info(mockMessage);

    expect(console.log).toHaveBeenCalledWith(
      chalk.bgYellow.black('[DynamicDoctor - Info]'),
      mockMessage,
      '\n',
    );
  });

  it('should log the error message correctly', () => {
    const mockMessage = 'Error message';

    DoctorLogger.error(mockMessage);

    expect(console.error).toHaveBeenCalledWith(
      chalk.bgRed.black('[DynamicDoctor - Error]'),
      mockMessage,
      '\n',
    );
  });

  it('should log the success message correctly', () => {
    const mockMessage = 'Success message';

    DoctorLogger.success(mockMessage);

    expect(console.log).toHaveBeenCalledWith(
      chalk.bgGreen.black('[DynamicDoctor - Success]'),
      mockMessage,
      '\n',
    );
  });

  it('should log the warning message correctly', () => {
    const mockMessage = 'Warning message';

    DoctorLogger.warning(mockMessage);

    expect(console.log).toHaveBeenCalledWith(
      chalk.bgYellow.black('[DynamicDoctor - Warning]'),
      mockMessage,
      '\n',
    );
  });
});
