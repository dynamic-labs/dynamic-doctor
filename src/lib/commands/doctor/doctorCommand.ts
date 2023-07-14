import { Command } from 'commander';

import { startDynamicDoctor } from '../../paths/startDynamicDoctor';

export const doctorCommand = () => {
  const command = new Command('doctor');

  command.action(startDynamicDoctor);

  return command;
};
