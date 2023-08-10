import { Command } from 'commander';

import { startDynamicDoctor } from '../../paths/startDynamicDoctor';

export const doctorCommand = () => {
  const command = new Command('run');

  command.description('It runs the DynamicDoctor.');
  command.action(startDynamicDoctor);

  return command;
};
