import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/index.ts",
    "!<rootDir>/src/types/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};

export default config;
