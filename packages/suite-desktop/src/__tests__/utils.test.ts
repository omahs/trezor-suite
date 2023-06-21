import { b2t } from '../libs/utils';

describe('utils', () => {
    test('should return Yes when true is input', () => {
        const result = b2t(true);
        expect(result).toBe('Yes');
    });

    test('should return No when false is input', () => {
        const result = b2t(false);
        expect(result).toBe('No');
    });
});
