import { Command } from 'commander';

import { doctorCommand } from './lib/commands/doctor';
import { sanityCommand } from './lib/commands/sanity';

export class DynamicCLI {
  program: Command;

  constructor() {
    this.program = new Command();
    this.program.name('dynamic-doctor');

    this.program.addCommand(doctorCommand(), {
      isDefault: true,
    });

    this.program.addCommand(sanityCommand());
  }

  run() {
    this.program.parse(process.argv);
  }
}
