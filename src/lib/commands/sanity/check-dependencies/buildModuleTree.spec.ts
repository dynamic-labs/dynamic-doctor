import { buildModuleTree } from './buildModuleTree';
import { buildMocks, fixtures } from './__fixtures__/fixtures';

jest.mock('fs');

describe('buildModuleTree', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe.each(Object.entries(fixtures))('fixture %s', (key, value) => {
    const basePath = '/specs';
    beforeEach(() => {
      buildMocks(value, basePath);
    });
    it('should build a module tree', () => {
      const moduleTree = buildModuleTree(basePath, basePath);
      expect(moduleTree).toMatchSnapshot();
    });

    it('should default cwd as base path', () => {
      jest.spyOn(process, 'cwd').mockReturnValue(basePath);
      const moduleTree = buildModuleTree();
      expect(moduleTree).toMatchSnapshot();
    });
  });
});
