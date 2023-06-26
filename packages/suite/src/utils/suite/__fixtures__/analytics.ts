import { AccountTransactionBaseAnchor } from 'src/constants/suite/anchors';

export const redactTransactionIdFromAnchor = [
    {
        input: undefined,
        expectedOutput: undefined,
    },
    {
        input: '@device-settings/homescreen',
        expectedOutput: '@device-settings/homescreen',
    },
    {
        input: `${AccountTransactionBaseAnchor}_0x63c29db1dbd2fa2ffe197d5bbfe93ad15e1599a6c42a7ad1b385823fa1e7cbd0`,
        expectedOutput: AccountTransactionBaseAnchor,
    },
    // Add more fixtures to cover additional scenarios and edge cases
];
