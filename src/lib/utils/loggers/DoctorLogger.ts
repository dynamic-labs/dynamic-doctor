/* eslint-disable no-console */
import chalk from 'chalk';

export class DoctorLogger {
  public static info(...args: any[]) {
    console.log(...args, '\n');
  }

  public static error(...args: any[]) {
    console.error(chalk.red( ...args), '\n');
  }

  public static success(...args: any[]) {
    console.log(
      chalk.green(...args),
      '\n',
    );
  }

  public static warning(...args: any[]) {
    console.log(
      chalk.yellow(...args),
      '\n',
    );
  }

  public static dashedLine() {
    const processColumns = process.stdout.columns;
    let columns: number = processColumns;
    if (!processColumns || processColumns <= 1) {
      columns = 80; // Default to 80 columns if no process columns are available
    }
    
    console.log(''); // One line break
    console.log(('─').repeat(columns));
  }
}
