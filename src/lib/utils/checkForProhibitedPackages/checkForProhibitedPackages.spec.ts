import { checkForProhibitedPackages } from './checkForProhibitedPackages'; // Update the import path accordingly
import { IssueCollector } from '../issueCollector/IssueCollector';

describe('checkForProhibitedPackages', () => {
  it('should add issues for prohibited dependencies', () => {
    const mockIssueCollector = new IssueCollector();
    const mockConfigFiles = [
      {
        path: 'path/to/tsconfig.json',
        configFile: [],
      },
      {
        path: 'path/to/package1/package.json',
        configFile: [
          { text: '"@blocto/sdk": "1.0.0"', spaces: 2 },
          {
            text: '"@dynamic-labs/sdk-react": "1.0.0"',
            spaces: 2,
          },
        ],
      },
    ];

    checkForProhibitedPackages(mockIssueCollector, mockConfigFiles);

    expect(mockIssueCollector.issues).toEqual([
      {
        type: 'error',
        message:
          'You have the following prohibited dependencies in path/to/package1/package.json: @blocto/sdk',
      },
    ]);
  });
});
