// eslint-disable-next-line import/extensions
const sharedConfig = require('../../jest.config.base.js');

module.exports = {
    ...sharedConfig,
    rootDir: './',
    coverageDirectory: './coverage',
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/*'],
    coverageThreshold: {
        global: {
            statements: 65,
            branches: 55,
            functions: 60,
            lines: 65,
        },
    },
};
