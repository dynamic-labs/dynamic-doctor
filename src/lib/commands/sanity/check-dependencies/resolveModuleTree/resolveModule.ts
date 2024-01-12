import { ModuleTree } from '../types';
import { REF_SEPARATOR } from '../constants';
import { getModuleReference } from './getModuleReference';

const getNextRefStep = (ref: string): string => {
  const modules = ref.split(REF_SEPARATOR);
  modules.pop(); // Drop last element
  const nextRef = modules.join(REF_SEPARATOR);
  return nextRef;
};

const resolveModuleRecursive = (
  moduleTree: ModuleTree,
  dependencyRef: string,
  moduleName: string,
  rootModuleTree: ModuleTree = moduleTree,
): string | null => {
  const currentModuleTree = getModuleReference(rootModuleTree, dependencyRef);
  if (currentModuleTree.modules[moduleName]) {
    return `${dependencyRef}${REF_SEPARATOR}${moduleName}`;
  } else if (dependencyRef === '.') {
    return null;
  }

  const nextRef = getNextRefStep(dependencyRef);
  const nextModuleTree = getModuleReference(rootModuleTree, nextRef);

  return resolveModuleRecursive(
    nextModuleTree,
    nextRef,
    moduleName,
    rootModuleTree,
  );
};

export const resolveModule = (
  moduleTree: ModuleTree,
  startingRef: string,
  moduleName: string,
) => resolveModuleRecursive(moduleTree, startingRef, moduleName);
