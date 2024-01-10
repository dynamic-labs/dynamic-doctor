import path from 'path';
import fs from 'fs';
import {
  DeepPartial,
  DependencyBranch,
  DependencyTree,
  PackageJson,
} from './types';
import { mergeDeep } from './utils';

//////////////////////////////
// Constants
//////////////////////////////
const DYNAMIC_PACKAGES = [/@dynamic-labs\/.*/];
const IGNORE_PACKAGES = ['@dynamic-labs/sdk-api', '@dynamic-labs/iconic'];

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

const isDynamicPackage = (packageName: string) => {
  return (
    DYNAMIC_PACKAGES.some((p) => p.test(packageName)) &&
    !isIgnoredPackage(packageName)
  );
};

const isIgnoredPackage = (packageName: string) => {
  return IGNORE_PACKAGES.includes(packageName);
};

export const createDependencyBranch = (
  branch: DeepPartial<DependencyBranch> = {},
): DependencyBranch => {
  const initialBranch: DependencyBranch = {
    name: '',
    package: {
      version: '',
      dependenices: {},
      peerDependencies: {},
      peerDependenciesMeta: {},
      nestedDependencies: {},
    },
    lineage: [],
    missing: false,
    meta: {
      isDynamic: false,
      isIgnored: false,
      isUnknown: false,
    },
    dependencies: {},
    peerDependencies: {},
    annotations: [],
  };
  return mergeDeep(initialBranch, structuredClone(branch));
};

export const isDependencyBranch = (
  obj: DependencyBranch | DependencyTree,
): obj is DependencyBranch => {
  return (
    'package' in obj &&
    'dependencies' in obj &&
    'peerDependencies' in obj &&
    'annotations' in obj &&
    'name' in obj &&
    'meta' in obj
  );
};

//////////////////////////////
// END Helper Methods
//////////////////////////////

export const buildDependencyTree = (
  basePath = process.cwd(),
  rootBasePath = process.cwd(),
  tree: Record<string, DependencyBranch> = {},
  rootTree: Record<string, DependencyBranch> = {},
): Record<string, DependencyBranch> => {
  const packageJsonPath = path.join(basePath, 'package.json');
  const nodeModulesPath = path.join(basePath, 'node_modules');

  let nextTree: Record<string, DependencyBranch> = tree;

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = readJsonFile<PackageJson>(packageJsonPath);

    const isDynamic = isDynamicPackage(packageJson.name);
    const isIgnored = isIgnoredPackage(packageJson.name);
    const isUnknown = !isDynamic && !isIgnored;

    if (basePath !== rootBasePath) {
      // Process branch of the tree.
      const branch = createDependencyBranch({
        name: packageJson.name,
        package: {
          version: packageJson.version,
          dependenices: packageJson.dependencies ?? {},
          peerDependencies: packageJson.peerDependencies ?? {},
          peerDependenciesMeta: packageJson.peerDependenciesMeta,
        },
        meta: {
          isDynamic,
          isIgnored,
          isUnknown,
        },
      });
      tree[packageJson.name] = branch;
      // The next tree is the nested dependencies of the current package.
      nextTree = branch.package.nestedDependencies;
    }

    // Process the nextTree (either the root tree or the nested dependencies of the current package)
    if (fs.existsSync(nodeModulesPath)) {
      const nodeModulesPackages = fs.readdirSync(nodeModulesPath);
      nodeModulesPackages
        .filter((dir) => !/^\./.test(dir)) // no hidden directories (eg. .bin)
        .reduce(
          (packages, dir) => mergeScopes(nodeModulesPath, packages, dir),
          [] as string[],
        )
        .forEach((nmPackage) =>
          buildDependencyTree(
            path.join(nodeModulesPath, nmPackage),
            rootBasePath,
            nextTree,
            rootTree,
          ),
        );
    }
  }
  return tree;
};
