module.exports = {
  bail: true,
  preset: 'ts-jest',
  roots: ['src/tests'],
  testEnvironment: 'node',
  testMatch: [
    '**/tests/components/**/*.test.(ts|js)',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
};
