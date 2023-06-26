// eslint-disable-next-line import/extensions
const sharedConfig = require('../../jest.config.base.js');

module.exports = {
    ...sharedConfig,
    rootDir: './',
    coverageDirectory: './coverage',
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/**', '<rootDir>/scripts/**'],
    coverageThreshold: {
        global: {
            statements: 60,
            branches: 70,
            functions: 55,
            lines: 65,
        },
    },
};
