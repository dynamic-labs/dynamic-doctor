import { DoctorLogger } from '../../../utils/loggers/DoctorLogger';
import { annotateTree } from './annotate-tree';
import { recurseVersionCheck } from './check-versions';
import { buildDependencyTree } from './dependency-tree';
import { reporter } from './reporter';

export const checkDependencies = (path?: string) => {
  try {
    const rawTree = buildDependencyTree(path, path);
    const tree = annotateTree(rawTree);
    const filteredTree = Object.fromEntries(
      Object.entries(tree).filter(([, value]) => value?.meta?.isDynamic),
    );
    recurseVersionCheck(filteredTree);
    reporter();
  } catch (e) {
    DoctorLogger.error(e);
    throw e;
  }
};
