import fetch from 'node-fetch';

import { DoctorLogger } from '../loggers/DoctorLogger';
import { checkForSdkUpdates } from './checkForSdkUpdates';
import { getPackageManager } from '../getPackageManager';
import { IssueCollector } from '../issueCollector/IssueCollector';
import { sdkVsSdkCoreDocsUrl } from '../../static/urls';

jest.mock('../loggers/DoctorLogger');
jest.mock('../getPackageManager');
jest.mock('node-fetch');
jest.mock('../issueCollector/IssueCollector');

const mockError = jest.fn();
const mockSuccess = jest.fn();
const mockWarning = jest.fn();

const mockGetPackageManager = getPackageManager as jest.Mock;
const mockFetch = fetch as unknown as jest.Mock;
const mockIssueCollector = IssueCollector as jest.Mock;

const issueCollector = new mockIssueCollector();

let mockPackages = {};

describe('checkForSdkUpdates', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    DoctorLogger.error = mockError;
    DoctorLogger.success = mockSuccess;
    DoctorLogger.warning = mockWarning;
    mockGetPackageManager.mockReturnValue({
      packageManager: 'npm',
      packageManagerVersion: '8.0.0',
    });
  });

  it('should return error of missing sdk-react/sdk-react-core package', async () => {
    await checkForSdkUpdates(issueCollector, mockPackages);

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

      mockPackages = {
        '@dynamic-labs/sdk-react': '1.0.0',
      };
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

      await checkForSdkUpdates(issueCollector, mockPackages);

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

      await checkForSdkUpdates(issueCollector, mockPackages);

      expect(issueCollector.addIssue).toHaveBeenCalledWith({
        type: 'warning',
        message:
          'Your Dynamic SDK is out of date: 1.0.0.\nLatest version is 2.0.0.\nCheck out our docs and try our latest using your package manager: npm install @dynamic-labs/sdk-react@latest',
      });
    });
  });

  describe('when sdk-react-core is used', () => {
    beforeEach(() => {
      jest.mock('../getInstalledPackages', () => ({
        getInstalledPackages: () => ({}),
      }));

      mockPackages = {
        '@dynamic-labs/sdk-react-core': '1.0.0',
      };
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

      await checkForSdkUpdates(issueCollector, mockPackages);

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

      await checkForSdkUpdates(issueCollector, mockPackages);

      expect(issueCollector.addIssue).toHaveBeenCalledWith({
        type: 'warning',
        message:
          'Your Dynamic SDK is out of date: 1.0.0.\nLatest version is 2.0.0.\nCheck out our docs and try our latest using your package manager: npm install @dynamic-labs/sdk-react-core@latest',
      });
    });

    describe('when alpha version is used', () => {
      beforeEach(() => {
        jest.mock('../getInstalledPackages', () => ({
          getInstalledPackages: () => ({}),
        }));

        mockPackages = {
          '@dynamic-labs/sdk-react-core': '2.0.0-alpha.1',
        };
      });

      it('should return warning if alpha version is outdated', async () => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            json: () => ({
              'dist-tags': {
                latest: '1.0.0',
                alpha: '2.0.0-alpha.2',
              },
            }),
          }),
        );

        await checkForSdkUpdates(issueCollector, mockPackages);

        expect(issueCollector.addIssue).toHaveBeenCalledWith({
          type: 'warning',
          message:
            "Your Dynamic SDK is out of date: 2.0.0-alpha.1.\nLatest alpha version is 2.0.0-alpha.2.\nCheck out our docs and try our latest using your package manager: npm install @dynamic-labs/sdk-react-core@alpha.\nIf you don't need alpha features we recommend using the latest stable version: npm install @dynamic-labs/sdk-react-core@latest. Please make sure to apply the version to all of Dynamic packages.",
        });
      });

      it('should return success if alpha version is latest', async () => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            json: () => ({
              'dist-tags': {
                latest: '1.0.0',
                alpha: '2.0.0-alpha.1',
              },
            }),
          }),
        );

        await checkForSdkUpdates(issueCollector, mockPackages);

        expect(mockSuccess).toHaveBeenCalledWith(
          'Your Dynamic SDK is up to date with our latest alpha: 2.0.0-alpha.1',
        );
      });

      it('should return warning if we already released a stable version for this alpha', async () => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            json: () => ({
              'dist-tags': {
                latest: '2.0.0',
                alpha: '3.0.0-alpha.1',
              },
            }),
          }),
        );

        await checkForSdkUpdates(issueCollector, mockPackages);

        expect(issueCollector.addIssue).toHaveBeenCalledWith({
          type: 'warning',
          message:
            'Your Dynamic SDK is an outdated alpha version.\nWe already released a stable version which contains all of the alpha features: 2.0.0.\nCheck out our docs and try our latest using your package manager: npm install @dynamic-labs/sdk-react-core@latest.',
        });
      });

      it('should return warning if we already released a newer stable version for this alpha', async () => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            json: () => ({
              'dist-tags': {
                latest: '3.0.0',
                alpha: '4.0.0-alpha.1',
              },
            }),
          }),
        );

        await checkForSdkUpdates(issueCollector, mockPackages);

        expect(issueCollector.addIssue).toHaveBeenCalledWith({
          type: 'warning',
          message:
            'Your Dynamic SDK is an outdated alpha version.\nWe already released a stable version which contains all of the alpha features: 3.0.0.\nCheck out our docs and try our latest using your package manager: npm install @dynamic-labs/sdk-react-core@latest.',
        });
      });
    });
  });

  describe('when both sdk-react and sdk-react-core are used', () => {
    beforeEach(() => {
      jest.mock('../getInstalledPackages', () => ({
        getInstalledPackages: () => ({}),
      }));

      mockPackages = {
        '@dynamic-labs/sdk-react': '1.0.0',
        '@dynamic-labs/sdk-react-core': '1.0.0',
      };
    });

    it('should return error if both sdk-react and sdk-react-core are used', async () => {
      await checkForSdkUpdates(issueCollector, mockPackages);

      expect(issueCollector.addIssue).toHaveBeenCalledWith({
        type: 'error',
        message: `You have both @dynamic-labs/sdk-react and @dynamic-labs/sdk-react-core installed. Please remove one of them. Check the difference here: ${sdkVsSdkCoreDocsUrl}`,
      });
    });
  });
});
