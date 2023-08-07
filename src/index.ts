import { Command } from 'commander';

import { doctorCommand } from './lib/commands/doctor';

export class DynamicCLI {

  program: Command;

  constructor() {
    this.program = new Command();
    this.program.name('Dynamic CLI');
    this.program.addCommand(doctorCommand());
  }

  run() {
    this.program.parse(process.argv);
  }
}