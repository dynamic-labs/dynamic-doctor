import chalk from 'chalk';
import { DoctorLogger } from '../../../utils/loggers/DoctorLogger';
import archy, { Data } from 'archy';
import { isEmpty } from './utils';
import { AuditResults } from './types';
import { REF_SEPARATOR, ROOT_REF } from './constants';
import { get } from 'http';

// const isOk = () => {
//   return (
//     !result.invalidDepVersion.length &&
//     !result.invalidPeerVersion.length &&
//     !result.missingDep.length &&
//     !result.missingPeer.length
//   );
// };

// export const reporter = () => {
//   // Emoki check
//   const status = chalk.bold(
//     isOk() ? chalk.green('✅ OK') : chalk.red('❌ FAIL'),
//   );
//   console.log(
//     `Sanity Checking ${chalk.bold('Dynamic SDK')} Dependencies... ${status}`,
//   );

//   if (isOk()) {
//     return;
//   }

//   report('dependencies', false, result.invalidDepVersion);
//   report('peer dependencies', false, result.invalidPeerVersion);
//   report('dependencies', true, result.missingDep);
//   report('peer dependencies', true, result.missingPeer);

//   console.log(
//     chalk.magentaBright(
//       '🛠  Ensure all dependencies are installed and meet version requirements.',
//     ),
//   );
//   DoctorLogger.newLine();
// };

// const report = (
//   depType: 'peer dependencies' | 'dependencies',
//   missing: boolean,
//   resultObj:
//     | Result['invalidPeerVersion']
//     | Result['invalidDepVersion']
//     | Result['missingDep']
//     | Result['missingPeer'],
// ) => {
//   if (!resultObj.length) {
//     return;
//   }

//   DoctorLogger.dashedLine();
//   console.log(chalk.bold(`${missing ? 'Missing' : 'Incorrect'} ${depType}:`));
//   resultObj.forEach(({ name, lineage, ...rest }) => {
//     const { requiredVersion, version } = rest as
//       | Result['invalidDepVersion'][number]
//       | Result['invalidPeerVersion'][number];
//     lineage.push(name);
//     const hierarchy: Data = lineage.reduceRight((acc, curr) => {
//       if (isEmpty(acc)) {
//         const label = `${curr}${version ? `@${version}` : ''}`;

//         acc['label'] = chalk.yellow(
//           `${label} ${
//             requiredVersion
//               ? chalk.red(`Incorrect version Required: ${requiredVersion}`)
//               : ''
//           }`,
//         );
//         return acc;
//       }
//       return {
//         label: curr,
//         nodes: [acc],
//       };
//     }, {} as Data);
//     console.log(archy(hierarchy));
//   });
//   process.exitCode = 1;
// };

const isDataObj = (obj: any): obj is Data => {
  if (typeof obj === 'string' || !obj) {
    return false;
  }
  return true;
};

const getNodeByLabel = (label: string, data: Data): Data => {
  const existingNode = data.nodes?.find(
    (node) => isDataObj(node) && node.label === label,
  );
  if (isDataObj(existingNode)) {
    return existingNode;
  }
  const newNode = {
    label,
    nodes: [],
  };
  data.nodes?.push(newNode);
  return newNode;
};

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getLabel = (
  ref: string,
  auditResult: AuditResults[keyof AuditResults],
) => {
  const target = ref.split(REF_SEPARATOR).pop();
  if (ref !== target) {
    return ref;
  }

  if (!auditResult.dependency) {
    return chalk.red(
      `${chalk.yellow(target)} ${capitalizeFirstLetter(
        auditResult.type,
      )} not found. Required version: ${auditResult.requiredVersion}`,
    );
  }

  return chalk.red(
    `${chalk.yellow(
      `${target}@${auditResult.installedVersion}`,
    )} ${capitalizeFirstLetter(
      auditResult.type,
    )} is not the required version: ${auditResult.requiredVersion}`,
  );
};

// Converts AuditResults to archy.Data using the key of AuditResults seperated by REF_SEPARATOR as nodes
const convertToArchy = (
  auditResults: AuditResults,
  archyData: archy.Data = {
    label: '',
    nodes: [],
  },
) => {
  Object.entries(auditResults).forEach(([key, value]) => {
    const refParts = key.split(REF_SEPARATOR);
    let data: Data = archyData;
    while (refParts.length > 0) {
      const [parent, child] = refParts;
      if (parent === ROOT_REF) {
        data = getNodeByLabel(child, archyData);
      } else if (child) {
        data.nodes?.push({
          label: getLabel(child, value),
          nodes: [],
        });
      }
      refParts.shift();
    }
  });
  return archyData;
};

export const reporter = (auditResults: AuditResults) => {
  return archy(convertToArchy(auditResults));
};
