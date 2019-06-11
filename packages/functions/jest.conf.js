module.exports = {
  rootDir: 'src',
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'ts', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+(?:!\\.d|)\\.ts$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)spec)\\.(jsx?|tsx?)$',
  globals: {
    'ts-jest': {
      "tsConfig": "./tsconfig.json"
    }
  }
}
