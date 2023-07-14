const installCommands: Record<string, string> = {
  npm: 'npm install',
  pnpm: 'pnpm install',
  yarn: 'yarn add',
};
export const getInstallCommand = (packageManager: string) =>
  installCommands[packageManager];
