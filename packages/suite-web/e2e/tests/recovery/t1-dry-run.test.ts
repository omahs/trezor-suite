// @group:device-management

describe.skip('Recovery - dry run', () => {
    beforeEach(() => {
        cy.task('startEmu', { version: '1-latest', wipe: true });
        cy.wait(2000);
        cy.task('setupEmu', { needs_backup: false });
        cy.task('startBridge');
        cy.viewport(1080, 1440).resetDb();
        cy.prefixedVisit('/settings/device');
        cy.passThroughInitialRun();
    });

    it('Dry run with T1', () => {
        cy.getTestElement('@settings/device/check-seed-button').click();
        cy.getTestElement('@recovery/user-understands-checkbox').click();
        cy.getTestElement('@recovery/start-button').click();

        cy.getTestElement('@recover/select-count/24').click();
        cy.getTestElement('@recover/select-type/advanced').click();
        cy.task('pressYes');
        cy.getTestElement('@recovery/word-input-advanced/1');

        // todo: elaborate more, seems like finally T1 tests are stable so it would make finally sense to finish this
    });
});

export {};
