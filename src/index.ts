import { Command } from 'commander';

import { doctorCommand } from './lib/commands/doctor';
import { sanityCommand } from './lib/commands/sanity';
import { treeCommand } from './lib/commands/sanity/sanityCommand';

export class DynamicCLI {
  program: Command;

  constructor() {
    this.program = new Command();
    this.program.name('dynamic-doctor');

    this.program.addCommand(doctorCommand(), {
      isDefault: true,
    });

    this.program.addCommand(sanityCommand());

    this.program.addCommand(treeCommand());
  }

  run() {
    this.program.parse(process.argv);
  }
}
