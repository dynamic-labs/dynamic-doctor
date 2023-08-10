import { IssueCollector } from './IssueCollector';
import { DoctorLogger } from '../loggers/DoctorLogger'; // Assuming this is the correct path

const mockDashedLine = jest.spyOn(DoctorLogger, 'dashedLine');
const mockError = jest.spyOn(DoctorLogger, 'error');
const mockWarning = jest.spyOn(DoctorLogger, 'warning');

describe('IssueCollector', () => {
  let issueCollector: IssueCollector;

  beforeEach(() => {
    issueCollector = new IssueCollector();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add and check for issues', () => {
    expect(issueCollector.hasIssues()).toBe(false);

    issueCollector.addIssue({ type: 'error', message: 'Test error' });
    expect(issueCollector.hasIssues()).toBe(true);
  });

  it('should print issues sorted correctly', () => {
    issueCollector.addIssue({ type: 'warning', message: 'Warning 1' });
    issueCollector.addIssue({ type: 'error', message: 'Error 1' });
    issueCollector.addIssue({ type: 'warning', message: 'Warning 2' });

    issueCollector.printIssues();

    expect(mockDashedLine).toHaveBeenCalledTimes(1);
    expect(mockError).toHaveBeenCalledWith('1.', 'Error 1');
    expect(mockWarning).toHaveBeenCalledWith('2.', 'Warning 1');
    expect(mockWarning).toHaveBeenCalledWith('3.', 'Warning 2');
  });
});
