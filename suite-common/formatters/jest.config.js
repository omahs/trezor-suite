// eslint-disable-next-line import/extensions
const sharedConfig = require('../../jest.config.base.js');

module.exports = {
    ...sharedConfig,
    rootDir: './',
    coverageDirectory: './coverage',
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/**'],
    coverageThreshold: {
        global: {
            statements: 40,
            branches: 45,
            functions: 30,
            lines: 40,
        },
    },
};
