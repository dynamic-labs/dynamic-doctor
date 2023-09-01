import { DynamicCLI } from './index';
import { startDynamicDoctor } from './lib/paths/startDynamicDoctor';

jest.mock('./lib/paths/startDynamicDoctor');

const mockStartDynamicDoctor = startDynamicDoctor as jest.Mock;

describe('DynamicCLI', () => {
  let dynamicCLI: DynamicCLI;

  beforeEach(() => {
    dynamicCLI = new DynamicCLI();
  });

  it('should create an instance of DynamicCLI', () => {
    expect(dynamicCLI).toBeInstanceOf(DynamicCLI);
  });

  it('should have the correct program name', () => {
    expect(dynamicCLI.program.name()).toBe('dynamic-doctor');
  });

  it('should be able to parse command line arguments', () => {
    const parseSpy = jest.spyOn(dynamicCLI.program, 'parse');

    dynamicCLI.run();

    expect(parseSpy).toHaveBeenCalled();
    expect(mockStartDynamicDoctor).toHaveBeenCalled();
  });
});
