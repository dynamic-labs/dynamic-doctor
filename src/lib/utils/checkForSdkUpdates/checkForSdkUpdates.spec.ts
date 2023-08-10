
import fetch from 'node-fetch';

import { DoctorLogger } from '../loggers/DoctorLogger';
import { getInstalledPackages } from '../getInstalledPackages';
import { checkForSdkUpdates } from './checkForSdkUpdates';
import { getPackageManager } from "../getPackageManager";
import { IssueCollector } from '../issueCollector/IssueCollector';

jest.mock('../loggers/DoctorLogger');
jest.mock('../getInstalledPackages');
jest.mock('../getPackageManager');
jest.mock('node-fetch');
jest.mock('../issueCollector/IssueCollector');

const mockError = jest.fn();
const mockSuccess = jest.fn();
const mockWarning = jest.fn();

const mockGetInstalledPackages = getInstalledPackages as jest.Mock;
const mockGetPackageManager = getPackageManager as jest.Mock;
const mockFetch = fetch as unknown as jest.Mock;
const mockIssueCollector = IssueCollector as jest.Mock;

const issueCollector = new mockIssueCollector();

describe('checkForSdkUpdates', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    DoctorLogger.error = mockError;
    DoctorLogger.success = mockSuccess;
    DoctorLogger.warning = mockWarning;
    mockGetInstalledPackages.mockReturnValue({});
    mockGetPackageManager.mockReturnValue({
      packageManager: 'npm',
      packageManagerVersion: '8.0.0',
    });
  });

  it('should return error of missing sdk-react/sdk-react-core package', async () => {
    await checkForSdkUpdates(issueCollector);

    expect(issueCollector.addIssue).toHaveBeenCalledWith({
        type: 'error',
        message: `No Dynamic SDK found in package.json. We can't check for updates.`,
    });
  });

  describe('when sdk-react is used', () => {
    beforeEach(() => {
      jest.mock('../getInstalledPackages', () => ({
        getInstalledPackages: () => ({}),
      }));

      mockGetInstalledPackages.mockReturnValue({
        '@dynamic-labs/sdk-react': '1.0.0',
      });
    });

    it('should return success if up to date', async () => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          json: () => ({
            'dist-tags': {
              latest: '1.0.0',
            },
          }),
        }),
      );

      await checkForSdkUpdates(issueCollector);

      expect(mockSuccess).toHaveBeenCalledWith(
        'Your Dynamic SDK is up to date: 1.0.0',
      );
    });

    it('should return warning if out of date', async () => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          json: () => ({
            'dist-tags': {
              latest: '2.0.0',
            },
          }),
        }),
      );

      await checkForSdkUpdates(issueCollector);

      expect(issueCollector.addIssue).toHaveBeenCalledWith({
        type: 'warning',
        message: 'Your Dynamic SDK is out of date: 1.0.0.\nLatest version is 2.0.0.\nCheck out our docs and try our latest using your package manager: npm install @dynamic-labs/sdk-react@latest',
      });
    });
  });

  describe('when sdk-react-core is used', () => {
    beforeEach(() => {
      jest.mock('../getInstalledPackages', () => ({
        getInstalledPackages: () => ({}),
      }));

      mockGetInstalledPackages.mockReturnValue({
        '@dynamic-labs/sdk-react-core': '1.0.0',
      });
    });

    it('should return success if up to date', async () => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          json: () => ({
            'dist-tags': {
              latest: '1.0.0',
            },
          }),
        }),
      );

      await checkForSdkUpdates(issueCollector);

      expect(mockSuccess).toHaveBeenCalledWith(
        'Your Dynamic SDK is up to date: 1.0.0',
      );
    });

    it('should return warning if out of date', async () => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          json: () => ({
            'dist-tags': {
              latest: '2.0.0',
            },
          }),
        }),
      );

      await checkForSdkUpdates(issueCollector);

      expect(issueCollector.addIssue).toHaveBeenCalledWith({
        type: 'warning',
        message: 'Your Dynamic SDK is out of date: 1.0.0.\nLatest version is 2.0.0.\nCheck out our docs and try our latest using your package manager: npm install @dynamic-labs/sdk-react-core@latest',
      });
    });
  });
});
