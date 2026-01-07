module.exports = {
  displayName: 'backend',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'esbuild-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/backend',
  moduleNameMapper: {
    '^@tmdigital/shared$': '<rootDir>/../../packages/shared/src/index.ts',
  },
};
