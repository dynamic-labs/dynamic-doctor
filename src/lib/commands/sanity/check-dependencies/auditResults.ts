import { REF_SEPARATOR } from './constants';
import { getModuleReference } from './resolveModuleTree';
import { AuditResults, ModuleTree } from './types';

const filterDynamicModules = (moduleTree: ModuleTree) => {
  return Object.fromEntries(
    Object.entries(moduleTree.modules).filter(([, module]) => module.isDynamic),
  );
};

const auditResultsRecursive = (
  moduleTree: ModuleTree,
  auditResultsStore: AuditResults = {},
) => {
  const dynamicModuleTree = filterDynamicModules(moduleTree);
  Object.values(dynamicModuleTree).forEach((module) => {
    Object.entries(module.resolved).forEach(
      ([resolvedModuleName, resolvedModule]) => {
        if (!resolvedModule.satisfied && !resolvedModule.optional) {
          const key = `${module.ref}${REF_SEPARATOR}${resolvedModuleName}`;
          auditResultsStore[key] = {
            ...resolvedModule,
            name: resolvedModuleName,
          };
          if (resolvedModule.ref) {
            const referencedModule = getModuleReference(
              moduleTree,
              resolvedModule.ref,
            );
            auditResultsStore[key].dependency = referencedModule;
            auditResultsRecursive(referencedModule, auditResultsStore);
          }
        }
      },
    );
  });

  return auditResultsStore;
};

export const auditResults = (moduleTree: ModuleTree) => {
  return auditResultsRecursive(moduleTree);
};
