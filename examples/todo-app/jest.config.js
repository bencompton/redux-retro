module.exports = {
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  testMatch: ['**/*.specs.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }]
  },
  moduleNameMapper: {
    '^redux-retro$': '<rootDir>/../../packages/redux-retro/src/index.ts',
    '^react-redux-retro$': '<rootDir>/../../packages/react-redux-retro/src/index.ts'
  }
};
