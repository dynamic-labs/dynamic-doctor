import { formatBasicData, FormattedData } from './formatBasicData';

describe('formatBasicData', () => {
  it('should format basic data correctly', () => {
    const inputData = {
      key1: {
        name: 'Name 1',
        version: 'Version 1',
      },
      key2: {
        name: 'Name 2',
        version: 'Version 2',
      },
    };

    const expectedOutput: FormattedData[] = [
      {
        name: 'Name 1',
        title: 'key1',
        value: 'Version 1',
      },
      {
        name: 'Name 2',
        title: 'key2',
        value: 'Version 2',
      },
    ];

    const result = formatBasicData(inputData);

    expect(result).toEqual(expectedOutput);
  });

  it('should return an empty array if input data is empty', () => {
    const inputData = {};

    const result = formatBasicData(inputData);

    expect(result).toEqual([]);
  });
});
