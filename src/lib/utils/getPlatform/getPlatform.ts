export const getPlatform = () => {
  const { node } = process.versions;
  const cpuArch = process.arch;
  const { platform } = process;

  return {
    cpuArch,
    node,
    platform,
  };
};
