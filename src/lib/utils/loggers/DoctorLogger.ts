/* eslint-disable no-console */
import chalk from 'chalk';

export class DoctorLogger {
  public static log(...args: any[]) {
    console.log(
      chalk.bgYellowBright.black('[DynamicDoctor - Log]'),
      ...args,
      '\n',
    );
  }

  public static info(...args: any[]) {
    console.log(chalk.bgYellow.black('[DynamicDoctor - Info]'), ...args, '\n');
  }

  public static error(...args: any[]) {
    console.error(chalk.bgRed.black('[DynamicDoctor - Error]'), ...args, '\n');
  }

  public static success(...args: any[]) {
    console.log(
      chalk.bgGreen.black('[DynamicDoctor - Success]'),
      ...args,
      '\n',
    );
  }

  public static warning(...args: any[]) {
    console.log(
      chalk.bgYellow.black('[DynamicDoctor - Warning]'),
      ...args,
      '\n',
    );
  }
}
