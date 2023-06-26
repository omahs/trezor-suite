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
            statements: 15,
            branches: 5,
            functions: 5,
            lines: 15,
        },
    },
};
