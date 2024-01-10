import satisfies from 'semver/functions/satisfies';
import result from './result';
import { DependencyBranch } from './types';
import { isEmpty } from './utils';

export const recurseVersionCheck = (
  rootTree: Record<string, DependencyBranch>,
  tree?: DependencyBranch,
  type?: 'peer' | 'dependency',
) => {
  // If we are at the root of the tree, we need to iterate over all the packages
  if (!tree) {
    Object.values(rootTree).forEach((rootPkg) => {
      if (!isEmpty(rootPkg.peerDependencies)) {
        Object.values(rootPkg.peerDependencies).forEach((value) => {
          recurseVersionCheck(rootTree, value, 'peer');
        });
      }
      if (!isEmpty(rootPkg.dependencies)) {
        Object.values(rootPkg.dependencies).forEach((value) => {
          recurseVersionCheck(rootTree, value, 'dependency');
        });
      }
    });
    return;
  }

  // If we are not at the root of the tree, we need to process the peers and dependencies
  if (tree.requiredVersion && tree?.package?.version && type && !tree.missing) {
    if (!satisfies(tree.package.version, tree.requiredVersion)) {
      if (type == 'peer') {
        result.invalidPeerVersion.push({
          name: tree.name,
          requiredVersion: tree.requiredVersion,
          version: tree.package.version,
          lineage: tree.lineage,
        });
      } else if (type == 'dependency') {
        result.invalidDepVersion.push({
          name: tree.name,
          requiredVersion: tree.requiredVersion,
          version: tree.package.version,
          lineage: tree.lineage,
        });
      }
    }
    return;
  }

  return;
};
