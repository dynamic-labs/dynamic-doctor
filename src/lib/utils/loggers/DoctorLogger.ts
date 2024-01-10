/* eslint-disable no-console */
import chalk from 'chalk';

export class DoctorLogger {
  public static info(...args: any[]) {
    console.log(...args);
  }

  public static error(...args: any[]) {
    console.log(chalk.red(...args));
  }

  public static success(...args: any[]) {
    console.log(chalk.green(...args));
  }

  public static warning(...args: any[]) {
    console.log(chalk.yellow(...args));
  }

  public static white(...args: any[]) {
    console.log(chalk.white(...args));
  }

  public static grey(...args: any[]) {
    console.log(chalk.grey(...args));
  }

  public static bold(...args: any[]) {
    console.log(chalk.bold(...args));
  }

  public static boldWhite(...args: any[]) {
    console.log(chalk.bold.white(...args));
  }

  public static boldGrey(...args: any[]) {
    console.log(chalk.bold.grey(...args));
  }

  public static boldRed(...args: any[]) {
    console.log(chalk.bold.red(...args));
  }

  public static dashedLine() {
    const processColumns = process.stdout.columns;
    let columns: number = processColumns;
    if (!processColumns || processColumns <= 1) {
      columns = 80; // Default to 80 columns if no process columns are available
    }

    console.log('─'.repeat(columns));
  }

  public static newLine() {
    console.log(''); // One line break
  }
}
