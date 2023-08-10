import chalk from 'chalk';

import { DoctorLogger } from './DoctorLogger';

jest.spyOn(console, 'log');
jest.spyOn(console, 'error');

describe('DoctorLogger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log the info message correctly', () => {
    const mockMessage = 'Info message';

    DoctorLogger.info(mockMessage);

    expect(console.log).toHaveBeenCalledWith(
      mockMessage,
    );
  });

  it('should log the error message correctly', () => {
    const mockMessage = 'Error message';

    DoctorLogger.error(mockMessage);

    expect(console.error).toHaveBeenCalledWith(
      chalk.red(mockMessage),
    );
  });

  it('should log the success message correctly', () => {
    const mockMessage = 'Success message';

    DoctorLogger.success(mockMessage);

    expect(console.log).toHaveBeenCalledWith(
      chalk.green(mockMessage),
    );
  });

  it('should log the warning message correctly', () => {
    const mockMessage = 'Warning message';

    DoctorLogger.warning(mockMessage);

    expect(console.log).toHaveBeenCalledWith(
      chalk.yellow(mockMessage),
    );
  });

  it('should log the dashed line correctly when there is no process variable', () => {
    const mockProcessColumns = 80;
    const mockDashedLine = '─'.repeat(mockProcessColumns);

    DoctorLogger.dashedLine();

    expect(console.log).toHaveBeenCalledWith(
      mockDashedLine,
    );
  });

  it('should log the dashed line correctly when there is no process variable', () => {
    process.stdout.columns = 100;
    const mockDashedLine = '─'.repeat(100);

    DoctorLogger.dashedLine();

    expect(console.log).toHaveBeenCalledWith(
      mockDashedLine,
    );
  });
});
