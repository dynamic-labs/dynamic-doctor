import { ModuleTree } from '../types';
import { REF_SEPARATOR } from '../constants';
import { getModuleReference } from './getModuleReference';
import { resolveModule } from './resolveModule';
import satisfies from 'semver/functions/satisfies';

const resolveModuleTreeModule = (
  type: 'dependency' | 'peerDependency',
  moduleName: string,
  module: ModuleTree,
  moduleTree: ModuleTree,
) => {
  const depType = type === 'dependency' ? 'dependencies' : 'peerDependencies';
  const deps = moduleTree[depType];

  if (deps && deps[moduleName]) {
    moduleTree.resolved[moduleName] = {
      type,
      ref: `${moduleTree.ref}${REF_SEPARATOR}${moduleName}`,
      optional: false,
      satisfied: satisfies(module.version, deps[moduleName]),
      requiredVersion: deps[moduleName],
      installedVersion: module.version,
    };
  }
};

const resolveModuleTreeModules = (
  moduleTree: ModuleTree,
  rootModuleTree: ModuleTree = moduleTree,
) => {
  Object.entries(moduleTree.modules).forEach(([moduleName, module]) => {
    resolveModuleTreeModule('dependency', moduleName, module, moduleTree);
    resolveModuleTreeModule('peerDependency', moduleName, module, moduleTree);
    resolveModuleTreeRecursive(module, rootModuleTree);
  });
};

const resolveModuleTreeDependenciesModule = (
  type: 'dependency' | 'peerDependency',
  moduleTree: ModuleTree,
  rootModuleTree: ModuleTree,
) => {
  const depType = type === 'dependency' ? 'dependencies' : 'peerDependencies';
  const deps = moduleTree[depType];

  if (deps) {
    Object.entries(deps).forEach(([moduleName, version]) => {
      // Handle npm aliases
      const aliasMatch = version.match(/^npm:(.*)@(.*)/);
      if (aliasMatch) {
        version = aliasMatch[2];
      }

      if (!moduleTree.resolved[moduleName]) {
        const resolvedRef = resolveModule(
          rootModuleTree,
          moduleTree.ref,
          moduleName,
        );

        const optional =
          moduleTree.peerDependenciesMeta?.[moduleName]?.optional ?? false;

        moduleTree.resolved[moduleName] = {
          type,
          ref: resolvedRef,
          optional,
          satisfied: false,
          requiredVersion: version,
          installedVersion: null,
        };

        if (resolvedRef) {
          const module = getModuleReference(rootModuleTree, resolvedRef);
          moduleTree.resolved[moduleName].satisfied = satisfies(
            module.version,
            version,
          );
          moduleTree.resolved[moduleName].installedVersion = module.version;
          module.isDynamic = moduleTree.isDynamic;
          resolveModuleTreeRecursive(module, rootModuleTree);
        }
      }
    });
  }
};

const resolveModuleTreeDependencies = (
  moduleTree: ModuleTree,
  rootModuleTree: ModuleTree = moduleTree,
) => {
  resolveModuleTreeDependenciesModule('dependency', moduleTree, rootModuleTree);
  resolveModuleTreeDependenciesModule(
    'peerDependency',
    moduleTree,
    rootModuleTree,
  );
};

const resolveModuleTreeRecursive = (
  moduleTree: ModuleTree,
  rootModuleTree: ModuleTree = moduleTree,
) => {
  resolveModuleTreeModules(moduleTree, rootModuleTree);
  resolveModuleTreeDependencies(moduleTree, rootModuleTree);
  return moduleTree;
};

export const resolveModuleTree = (moduleTree: ModuleTree) => {
  moduleTree = structuredClone(moduleTree);
  return resolveModuleTreeRecursive(moduleTree);
};
