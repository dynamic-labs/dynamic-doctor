import { buildMocks, fixtures } from './__fixtures__/fixtures';
import { auditResults } from './auditResults';
import { buildModuleTree } from './buildModuleTree';
import { resolveModuleTree } from './resolveModuleTree';

jest.mock('fs');

describe('auditResults', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe.each(Object.entries(fixtures))('fixture %s', (key, value) => {
    const basePath = '/specs';
    beforeEach(() => {
      buildMocks(value, basePath);
    });
    it('should audit a module tree', () => {
      const moduleTree = buildModuleTree(basePath, basePath);
      const resolvedModuleTree = resolveModuleTree(moduleTree);
      const audit = auditResults(resolvedModuleTree);
      expect(audit).toMatchSnapshot();
    });
  });
});
