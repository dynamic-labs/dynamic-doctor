export type PackageJson = {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  peerDependenciesMeta: {
    [key: string]: {
      optional: boolean;
    };
  };
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type DependencyBranch = {
  name: string;
  package: {
    version: string;
    dependenices: Record<string, string>;
    peerDependencies: Record<string, string>;
    peerDependenciesMeta: {
      [key: string]: {
        optional: boolean;
      };
    };
    nestedDependencies: Record<string, DependencyBranch>;
  };
  meta: {
    isDynamic: boolean;
    isIgnored: boolean;
    isUnknown: boolean;
  };
  lineage: string[];
  missing: boolean;
  requiredVersion?: string;
  dependencies: Record<string, DependencyBranch>;
  peerDependencies: Record<string, DependencyBranch>;
  annotations: string[];
  [key: string]: any;
};

export type DependencyTree = Record<string, DependencyBranch>;
