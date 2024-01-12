import { getModuleReference } from './getModuleReference';

describe('getModuleReference', () => {
  it('expects error when next module reference doesnt exist', () => {
    expect(() =>
      getModuleReference(
        { modules: { module1: { ref: '.:module2', modules: {} } } } as any,
        'module1:module2:module3',
      ),
    ).toThrowError(
      /Invalid ref: module1:module2:module3, could not find next module: module2/,
    );
  });

  it('expects error when next module reference doesnt exist', () => {
    expect(() =>
      getModuleReference(
        { modules: { module1: { ref: '.:module2', modules: {} } } } as any,
        '',
      ),
    ).toThrowError(/Invalid ref:/);
  });
});
