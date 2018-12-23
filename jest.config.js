module.exports = {
  globals: {
    "ts-jest": {
      "tsConfigFile": "tsconfig.json"
    },
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testEnvironment: "node",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
};
