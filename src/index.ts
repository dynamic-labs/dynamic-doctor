import { Command } from 'commander';

import { doctorCommand } from './lib/commands/doctor';

export class DynamicCLI {
  program: Command;

  constructor() {
    this.program = new Command();
    this.program.name('dynamic-doctor');

    this.program.addCommand(doctorCommand(), {
      isDefault: true,
    });
  }

  run() {
    this.program.parse(process.argv);
  }
}
