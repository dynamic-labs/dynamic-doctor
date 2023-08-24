/* eslint-disable */
export default {
  displayName: 'doctor',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  resetMocks: false,
  maxWorkers: '2',
  workerIdleMemoryLimit: '2.25gb',
  preset: 'ts-jest',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov'],
};
