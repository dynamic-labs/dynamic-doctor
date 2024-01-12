import chalk from 'chalk';
import archy, { Data } from 'archy';
import { AuditResults } from './types';
import { REF_SEPARATOR, ROOT_REF } from './constants';

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
