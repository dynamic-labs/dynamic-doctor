import { createDependencyBranch, isDependencyBranch } from './dependency-tree';
import result from './result';
import { DependencyBranch } from './types';
import { isEmpty } from './utils';

/**
 * Recursively annotate the tree with peer and dependency information
 * @param tree
 * @param rootTree
 * @param pkgName
 * @param lineage
 * @returns
 */
export const annotateTree = (
  tree: Record<string, DependencyBranch> | DependencyBranch,
  pkgName?: string,
  rootTree: Record<string, DependencyBranch> | DependencyBranch = {},
  lineage: string[] = [],
) => {
  if (isEmpty(rootTree) && !isDependencyBranch(tree)) {
    rootTree = tree;
  }

  if (!isDependencyBranch(tree)) {
    /**
     * If we are at the root of the tree, we need to iterate over all the packages
     */
    Object.entries(tree).forEach(([key, value]) => {
      if (value.meta?.isDynamic) {
        processPeers(value, key, rootTree, [key]);
        processDependencies(value, key, rootTree, [key]);
      }
    });
  } else if (pkgName) {
    /**
     * If we are not at the root of the tree, we need to process the peers and dependencies
     */
    processPeers(tree, pkgName, rootTree, [...lineage, pkgName]);
    processDependencies(tree, pkgName, rootTree, [...lineage, pkgName]);
  }
  return tree;
};

const processPeers = (
  value: DependencyBranch,
  pkgName: string,
  rootTree: Record<string, DependencyBranch> | DependencyBranch,
  lineage: string[] = [],
) => {
  const peers = Object.keys(value.package.peerDependencies);

  // If we have already annotated this package, return
  if (value.annotations.includes('peers')) {
    return value;
  }

  // If we have not annotated this package, add the annotation
  value.annotations.push('peers');

  // Iterate over the peers
  peers.forEach((peer) => {
    // Check root tree for peer as some package managers de-dupe peers
    if (rootTree[peer]) {
      // If the peer is in the root tree, annotate it
      annotateTree(rootTree[peer], peer, rootTree, lineage);
      if (value.package?.peerDependencies) {
        const newPeer = createDependencyBranch({
          ...structuredClone(rootTree[peer]),
          requiredVersion: value.package?.peerDependencies?.[peer],
          lineage,
        });
        if (!isDependencyBranch(newPeer))
          throw new Error(`Invalid peer ${peer}`);
        if (!value.peerDependencies) value.peerDependencies = {};
        value.peerDependencies[peer] = newPeer;
      }

      // Check if peer is optional, if so, ignore
    } else if (!value.package?.peerDependenciesMeta?.[peer]?.optional) {
      value.peerDependencies[peer] = createDependencyBranch({
        missing: true,
        lineage,
        requiredVersion: value.package?.peerDependencies?.[peer],
      });
      result.missingPeer.push({
        name: peer,
        lineage,
      });
    }
  });

  return value;
};

const processDependencies = (
  value: DependencyBranch,
  pkgName: string,
  rootTree: Record<string, DependencyBranch> | DependencyBranch,
  lineage: string[] = [],
) => {
  const deps = Object.keys(value.dependencies ?? {});

  if (value.annotations?.includes('dependencies')) {
    return value;
  }

  if (!value.annotations) {
    value.annotations = [];
  }
  value.annotations.push('dependencies');

  deps.forEach((dep) => {
    if (value.package.nestedDependencies[dep]) {
      annotateTree(
        value.package.nestedDependencies[dep],
        dep,
        rootTree,
        lineage,
      );
      delete value.dependencies[dep];
      delete value.package.nestedDependencies[dep];
    } else if (rootTree[dep]) {
      annotateTree(rootTree[dep], dep, rootTree, lineage);
      delete value.dependencies[dep];
    } else {
      delete value.dependencies[dep];
      result.missingDep.push({
        name: dep,
        lineage,
      });
    }
  });
  return value;
};
