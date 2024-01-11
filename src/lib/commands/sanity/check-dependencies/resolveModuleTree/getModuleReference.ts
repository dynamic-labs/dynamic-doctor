import { ModuleTree } from '../types';
import { REF_SEPARATOR, ROOT_REF } from '../constants';

const getModuleReferenceRecursive = (
  moduleTree: ModuleTree,
  ref: string,
  originalRef = ref,
): ModuleTree => {
  // Return the root module tree
  if (ref === ROOT_REF) {
    return moduleTree;
  }

  // Split the ref into module parts
  const refParts = ref.split(REF_SEPARATOR);

  // Grab the left most module
  let nextModule = refParts.shift();
  if (nextModule === ROOT_REF) {
    nextModule = refParts.shift();
  }

  if (nextModule) {
    // As we are descending the tree, we need to make sure the next module exists
    if (!moduleTree.modules[nextModule]) {
      throw new Error(
        `Invalid ref: ${originalRef}, could not find next module: ${nextModule}`,
      );
    }

    // If there are no more parts, we have found the module
    if (refParts.length === 0) {
      return moduleTree.modules[nextModule];
    } else {
      // Otherwise, recurse down the tree
      return getModuleReferenceRecursive(
        moduleTree.modules[nextModule],
        refParts.join(REF_SEPARATOR),
        originalRef,
      );
    }
  }

  // If we have not returned by now, the ref is invalid
  throw new Error(`Invalid ref: ${originalRef}`);
};

/**
 * Get the module reference in the tree given a ref string
 *
 * This does not resolve for missing modules, the module MUST exist in the tree
 * @example getModuleReference('module1:module2:module3', moduleTree)
 * @param ref A colon separated string of module names to traverse
 * @param moduleTree The root module tree
 * @returns The module tree at the ref
 */
export const getModuleReference = (
  moduleTree: ModuleTree,
  ref: string,
): ModuleTree => getModuleReferenceRecursive(moduleTree, ref);
