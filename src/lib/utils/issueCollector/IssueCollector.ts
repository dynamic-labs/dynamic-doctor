import { DoctorLogger } from '../loggers/DoctorLogger';

type Issue = {
  type: 'error' | 'warning';
  message: string;
};

export class IssueCollector {
  issues: Issue[] = [];

  addIssue(issue: Issue) {
    this.issues.push(issue);
  }

  hasIssues() {
    return this.issues.length > 0;
  }

  printIssues() {
    DoctorLogger.dashedLine();

    DoctorLogger.warning('Dynamic Doctor found the following issues:');

    this.sortIssues();

    this.issues.forEach((issue, index) => {
      const realIndex = index + 1;

      if (issue.type === 'error') {
        DoctorLogger.error(`${realIndex}.`, issue.message);
      }

      DoctorLogger.warning(`${realIndex}.`, issue.message);
    });
  }

  private sortIssues() {
    this.issues.sort((a, b) => {
      if (a.type === 'error' && b.type === 'warning') {
        return -1;
      }
      if (a.type === 'warning' && b.type === 'error') {
        return 1;
      }
      return 0;
    });
  }
}
