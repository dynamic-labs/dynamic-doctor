/* eslint-disable no-console */
import chalk from 'chalk';

export class DoctorLogger {
  public static info(...args: any[]) {
    console.log(...args);
    this.newLine();
  }

  public static error(...args: any[]) {
    console.error(chalk.red(...args));
    this.newLine();
  }

  public static success(...args: any[]) {
    console.log(chalk.green(...args));
    this.newLine();
  }

  public static warning(...args: any[]) {
    console.log(chalk.yellow(...args));
    this.newLine();
  }

  public static dashedLine() {
    const processColumns = process.stdout.columns;
    let columns: number = processColumns;
    if (!processColumns || processColumns <= 1) {
      columns = 80; // Default to 80 columns if no process columns are available
    }

    this.newLine();
    console.log('─'.repeat(columns));
    this.newLine();
  }

  public static newLine() {
    console.log(''); // One line break
  }
}
