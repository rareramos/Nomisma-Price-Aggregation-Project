module.exports = {
  bail: true,
  cacheDirectory: '.jest-cache',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  globals: {
    USE_OWN_API: true,
    CFD_API_URL: 'ws://localhost:38496',
    API_URI: 'http://localhost:8000',
  },
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  testURL: 'http://localhost/',
  setupFilesAfterEnv: [
    require.resolve('./test/setup-test-framework'),
  ],
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx',
  ],
  testRegex: '(/__tests__/.|(\\.|/)(test|spec))\\.(ts|tsx|js)$',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        '/__mocks__/file-mock.js',
  },
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@amcharts|@nomisma)/)',
  ],
};
