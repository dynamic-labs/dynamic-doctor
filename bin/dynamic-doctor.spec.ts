import { DynamicCLI } from '../src';

jest.mock('../src');

const mockDynamicCLI = DynamicCLI as jest.Mock;

describe('dynamic-doctor', () => {
  it('should create an instance of DynamicCLI', () => {
    require('./index');

    expect(mockDynamicCLI).toHaveBeenCalled();
  });
});
