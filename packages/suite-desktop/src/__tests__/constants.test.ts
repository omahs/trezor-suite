/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */

describe('getAppName', () => {
    it('should return the app name with "Local" for non-production, non-code-signed build', () => {
        jest.mock('@suite-common/suite-utils', () => ({
            isDevEnv: true,
            isCodesignBuild: false,
        }));

        jest.resetModules();

        const { getAppName } = require('../libs/constants');
        expect(getAppName()).toBe('Trezor Suite Local');
    });

    it('should return the app name with "Dev" for production, non-code-signed build', () => {
        jest.mock('@suite-common/suite-utils', () => ({
            isDevEnv: false,
            isCodesignBuild: false,
        }));
        jest.resetModules();

        const { getAppName } = require('../libs/constants');
        expect(getAppName()).toBe('Trezor Suite Dev');
    });

    it('should return the app name for production code-signed build', () => {
        jest.mock('@suite-common/suite-utils', () => ({
            isDevEnv: false,
            isCodesignBuild: true,
        }));
        jest.resetModules();

        const { getAppName } = require('../libs/constants');
        expect(getAppName()).toBe('Trezor Suite');
    });
});

export {};
