import * as fixtures from '../__fixtures__/analytics';
import { redactTransactionIdFromAnchor } from '../analytics';

describe('redactTransactionIdFromAnchor', () => {
    fixtures.redactTransactionIdFromAnchor.forEach(fixture => {
        const { input, expectedOutput } = fixture;

        it(`should return ${expectedOutput} when anchor is ${input}`, () => {
            const result = redactTransactionIdFromAnchor(input);
            expect(result).toEqual(expectedOutput);
        });
    });
});
