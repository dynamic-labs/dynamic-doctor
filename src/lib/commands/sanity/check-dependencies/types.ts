export type PackageJson = {
  name: string;
  version: string;
  exports: Record<string, any>;
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  peerDependenciesMeta: {
    [key: string]: {
      optional: boolean;
    };
  };
};

export type ResolvedModule = {
  type: 'dependency' | 'peerDependency';
  ref: string | null;
  optional: boolean;
  satisfied: boolean;
  requiredVersion: string;
  installedVersion: string | null;
};

export type ModuleTree = {
  name: string;
  version: string;
  isDynamic: boolean;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: Record<string, any>;
  resolved: Record<string, ResolvedModule>;
  ref: string;
  modulePath: string;
  moduleLineage: string[];
  modules: Record<string, ModuleTree>;
};

export type ModuleTreeResolved = Omit<ModuleTree, 'modules'> & {
  modules: Record<string, ModuleTreeResolved | string>;
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type AuditResults = {
  [key: string]: ResolvedModule & {
    name: string;
    dependency?: ModuleTree;
  };
};
