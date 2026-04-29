module.exports = {
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  testMatch: ['**/*.specs.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^redux-retro$': '<rootDir>/../../packages/redux-retro/src/index.ts'
  }
};
