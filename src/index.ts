#! /usr/bin/env node
import { Command } from 'commander';

import { doctorCommand } from './lib/commands/doctor';

const program = new Command();

program.name('Dynamic CLI');

program.addCommand(doctorCommand());

program.parse(process.argv);
