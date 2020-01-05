module.exports = {
  bail: true,
  preset: 'ts-jest',
  roots: ['src'],
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.test.(ts|js)',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
};
