import { Command } from 'commander';
import { checkDependencies } from './check-dependencies';

export const sanityCommand = () => {
  const command = new Command('sanity');
  command.argument(
    '[path]',
    'Path of the project using Dynamic SDK (defaults to current directory)',
  );
  command.action(checkDependencies);
  command.enablePositionalOptions();
  return command;
};
