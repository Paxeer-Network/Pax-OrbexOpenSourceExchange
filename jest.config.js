/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  moduleNameMapper: {
    "^@b/(.*)$": "<rootDir>/backend/$1",
    "^@db/(.*)$": "<rootDir>/models/$1",
  },
};
