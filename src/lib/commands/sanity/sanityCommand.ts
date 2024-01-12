import { Command } from 'commander';
import { checkDependencies } from './check-dependencies';
import { buildModuleTree } from './check-dependencies/buildModuleTree';

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

export const treeCommand = () => {
  const command = new Command('tree');
  command.argument(
    '[path]',
    'Path of the project using Dynamic SDK (defaults to current directory)',
  );
  command.action((path) => console.log(JSON.stringify(buildModuleTree(path, path), null, 2)));
  command.enablePositionalOptions();
  return command;
}