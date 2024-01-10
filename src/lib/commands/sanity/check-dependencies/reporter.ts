import chalk from 'chalk';
import { DoctorLogger } from '../../../utils/loggers/DoctorLogger';
import result, { Result } from './result';
import archy, { Data } from 'archy';
import { isEmpty } from './utils';

const isOk = () => {
  return (
    !result.invalidDepVersion.length &&
    !result.invalidPeerVersion.length &&
    !result.missingDep.length &&
    !result.missingPeer.length
  );
};

export const reporter = () => {
  // Emoki check
  const status = chalk.bold(
    isOk() ? chalk.green('✅ OK') : chalk.red('❌ FAIL'),
  );
  console.log(
    `Sanity Checking ${chalk.bold('Dynamic SDK')} Dependencies... ${status}`,
  );

  if (isOk()) {
    return;
  }

  report('dependencies', false, result.invalidDepVersion);
  report('peer dependencies', false, result.invalidPeerVersion);
  report('dependencies', true, result.missingDep);
  report('peer dependencies', true, result.missingPeer);

  console.log(
    chalk.magentaBright(
      '🛠  Ensure all dependencies are installed and meet version requirements.',
    ),
  );
  DoctorLogger.newLine();
};

const report = (
  depType: 'peer dependencies' | 'dependencies',
  missing: boolean,
  resultObj:
    | Result['invalidPeerVersion']
    | Result['invalidDepVersion']
    | Result['missingDep']
    | Result['missingPeer'],
) => {
  if (!resultObj.length) {
    return;
  }

  DoctorLogger.dashedLine();
  console.log(chalk.bold(`${missing ? 'Missing' : 'Incorrect'} ${depType}:`));
  resultObj.forEach(({ name, lineage, ...rest }) => {
    const { requiredVersion, version } = rest as
      | Result['invalidDepVersion'][number]
      | Result['invalidPeerVersion'][number];
    lineage.push(name);
    const hierarchy: Data = lineage.reduceRight((acc, curr) => {
      if (isEmpty(acc)) {
        const label = `${curr}${version ? `@${version}` : ''}`;

        acc['label'] = chalk.yellow(
          `${label} ${
            requiredVersion
              ? chalk.red(`Incorrect version Required: ${requiredVersion}`)
              : ''
          }`,
        );
        return acc;
      }
      return {
        label: curr,
        nodes: [acc],
      };
    }, {} as Data);
    console.log(archy(hierarchy));
  });
  process.exitCode = 1;
};
