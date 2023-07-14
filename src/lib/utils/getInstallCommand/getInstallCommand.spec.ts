import { getInstallCommand } from './getInstallCommand';

describe('getInstallCommand', () => {
  it('should return the correct install command for npm', () => {
    const packageManager = 'npm';
    const expectedCommand = 'npm install';

    const result = getInstallCommand(packageManager);

    expect(result).toBe(expectedCommand);
  });

  it('should return the correct install command for pnpm', () => {
    const packageManager = 'pnpm';
    const expectedCommand = 'pnpm install';

    const result = getInstallCommand(packageManager);

    expect(result).toBe(expectedCommand);
  });

  it('should return the correct install command for yarn', () => {
    const packageManager = 'yarn';
    const expectedCommand = 'yarn add';

    const result = getInstallCommand(packageManager);

    expect(result).toBe(expectedCommand);
  });

  it('should return undefined for an unknown package manager', () => {
    const packageManager = 'unknown';

    const result = getInstallCommand(packageManager);

    expect(result).toBeUndefined();
  });
});
