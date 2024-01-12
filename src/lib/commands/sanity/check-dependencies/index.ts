import { DoctorLogger } from '../../../utils/loggers/DoctorLogger';
import { auditResults } from './auditResults';
import { buildModuleTree } from './buildModuleTree';
import { reporter } from './reporter';
import { resolveModuleTree } from './resolveModuleTree';

export const checkDependencies = (path?: string) => {
  try {
    const moduleTree = buildModuleTree(path, path);
    const resolvedModuleTree = resolveModuleTree(moduleTree);
    const audit = auditResults(resolvedModuleTree);
    //console.log(JSON.stringify(resolveModuleTree(rawTree), null, 2));
    // const tree = annotateTree(rawTree);
    // const filteredTree = Object.fromEntries(
    //   Object.entries(tree).filter(([, value]) => value?.meta?.isDynamic),
    // );
    // recurseVersionCheck(filteredTree);
    // reporter();
    //console.log(reporter(audit));
    console.log(reporter(audit));
  } catch (e) {
    DoctorLogger.error(e);
    throw e;
  }
};
