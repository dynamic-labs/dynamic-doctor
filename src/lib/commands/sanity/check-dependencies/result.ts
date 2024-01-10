export type Result = {
  missingPeer: {
    name: string;
    lineage: string[];
  }[];
  missingDep: {
    name: string;
    lineage: string[];
  }[];
  invalidDepVersion: {
    name: string;
    requiredVersion: string;
    version: string;
    lineage: string[];
  }[];
  invalidPeerVersion: {
    name: string;
    requiredVersion: string;
    version: string;
    lineage: string[];
  }[];
};

const result: Result = {
  missingPeer: [],
  missingDep: [],
  invalidDepVersion: [],
  invalidPeerVersion: [],
};

export default result;
