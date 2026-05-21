/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__', '<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // Skip RN/Expo modules — we only run pure-logic tests for now.
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$))'],
  testPathIgnorePatterns: ['/node_modules/', '/functions/'],
  collectCoverageFrom: [
    'src/lib/utils/**/*.ts',
    'src/store/**/*.ts',
    '!**/*.d.ts',
  ],
};
