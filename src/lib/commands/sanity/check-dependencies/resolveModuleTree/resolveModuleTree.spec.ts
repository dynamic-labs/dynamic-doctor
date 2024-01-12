import { buildMocks, fixtures } from '../__fixtures__/fixtures';
import { buildModuleTree } from '../buildModuleTree';
import { resolveModuleTree } from './resolveModuleTree';

jest.mock('fs');

describe('resolveModuleTree', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe.each(Object.entries(fixtures))('fixture %s', (key, value) => {
    const basePath = '/specs';
    beforeEach(() => {
      buildMocks(value, basePath);
    });
    it('should resolve a module tree', () => {
      const moduleTree = buildModuleTree(basePath, basePath);
      const resolvedModuleTree = resolveModuleTree(moduleTree);
      expect(resolvedModuleTree).toMatchSnapshot();
    });
  });
});
