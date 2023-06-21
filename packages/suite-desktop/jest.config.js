module.exports = {
    roots: ['<rootDir>/src'],
    moduleFileExtensions: ['js', 'ts', 'tsx'],
    coverageDirectory: './coverage',
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/libs/*'],
    coverageThreshold: {
        global: {
            statements: 25,
            branches: 25,
            functions: 20,
            lines: 25,
        },
    },
    modulePathIgnorePatterns: ['node_modules', '<rootDir>/lib', '<rootDir>/libDev'],
    transformIgnorePatterns: ['/node_modules/'],
    testMatch: ['**/*.test.(ts|tsx|js)'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    verbose: false,
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.json',
        },
    },
};
