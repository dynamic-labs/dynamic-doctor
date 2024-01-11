import path from 'path';
import fs from 'fs';
import { ModuleTree, PackageJson } from './types';
import { REF_SEPARATOR, ROOT_REF } from './constants';
import { isDynamicPackage } from './utils';

//////////////////////////////
// Helper Methods
//////////////////////////////

/**
 * Reads a json file and returns the parsed json.
 * @param filePath
 * @returns
 */
const readJsonFile = <T>(filePath: string) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').trim()) as T;
};

/**
 * Merges the scoped packages into the packages array.
 * @param basePath
 * @param packages
 * @param dir
 * @returns
 */
const mergeScopes = (basePath: string, packages: string[], dir: string) => {
  if (/^@/.test(dir)) {
    const scopedSuffixPackages = fs
      .readdirSync(path.join(basePath, dir))
      .filter((packageName) => !/^\./.test(packageName));
    return packages.concat(scopedSuffixPackages.map((p) => path.join(dir, p)));
  } else {
    return packages.concat(dir);
  }
};

//////////////////////////////
// END Helper Methods
//////////////////////////////

const initialBranch = (): ModuleTree =>
  structuredClone({
    name: '',
    version: '',
    dependencies: {},
    isDynamic: false,
    peerDependencies: {},
    peerDependenciesMeta: {},
    resolved: {},
    ref: '',
    moduleLineage: [],
    modules: {},
    modulePath: '',
  });

// This variable will be mutated by the buildModuleTree function
const moduleTreeStore: ModuleTree = initialBranch();

const resolveLineage = (modulePath: string) => {
  const lineage = modulePath
    .split(/\/?node_modules\//)
    .filter((p) => p && p !== ROOT_REF);
  lineage.unshift(ROOT_REF);
  return lineage;
};

const buildModuleTreeRecursive = (
  basePath: string,
  rootBasePath: string,
  currentModuleBranch: ModuleTree = moduleTreeStore,
  isDynamicFlag = false,
): ModuleTree => {
  const packageJsonPath = path.join(basePath, 'package.json');
  const nodeModulesPath = path.join(basePath, 'node_modules');
  const isRootPkg = basePath === rootBasePath;

  if (fs.existsSync(packageJsonPath)) {
    const modulePath = isRootPkg ? '.' : path.relative(rootBasePath, basePath);
    const packageJson = readJsonFile<PackageJson>(packageJsonPath);
    const ref = resolveLineage(modulePath).join(REF_SEPARATOR);
    isDynamicFlag = isDynamicFlag || isDynamicPackage(ref);

    // If we are a nested module, set the moduleTree branch to the current module.
    currentModuleBranch = isRootPkg
      ? currentModuleBranch
      : (currentModuleBranch['modules'][packageJson.name] = initialBranch());

    Object.assign(currentModuleBranch, {
      name: packageJson.name,
      version: packageJson.version,
      isDynamic: isDynamicFlag,
      dependencies: packageJson.dependencies,
      peerDependencies: packageJson.peerDependencies,
      peerDependenciesMeta: packageJson.peerDependenciesMeta,
      ref,
      moduleLineage: resolveLineage(modulePath),
      modules: {},
      modulePath,
    });

    if (fs.existsSync(nodeModulesPath)) {
      const nodeModulesPackages = fs.readdirSync(nodeModulesPath);
      // Filter out hidden directories (eg. .bin)
      // Get fully scoped package names (eg. @dynamic-labs/sdk-api)
      const nodules = nodeModulesPackages
        .filter((dir) => !/^\./.test(dir)) // no hidden directories (eg. .bin)
        .reduce(
          (packages, dir) => mergeScopes(nodeModulesPath, packages, dir),
          [] as string[],
        );

      // Recurse through modules
      nodules.forEach((nmPackage) =>
        buildModuleTreeRecursive(
          path.join(nodeModulesPath, nmPackage),
          rootBasePath,
          currentModuleBranch,
          isDynamicFlag,
        ),
      );
    }
  }

  return currentModuleBranch;
};

export const buildModuleTree = (
  basePath = process.cwd(),
  rootBasePath = process.cwd(),
) => buildModuleTreeRecursive(basePath, rootBasePath);
