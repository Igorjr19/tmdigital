export default {
  displayName: 'backend-e2e',
  testEnvironment: 'node',
  rootDir: '../../',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/apps/backend-e2e/tsconfig.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  coverageDirectory: '<rootDir>/coverage/apps/backend-e2e',
  testMatch: ['<rootDir>/apps/backend-e2e/**/*.e2e-spec.ts'],
  moduleNameMapper: {
    '^@tmdigital/backend-e2e/(.*)$': '<rootDir>/apps/backend-e2e/src/$1',
  },
  transformIgnorePatterns: [],
};
