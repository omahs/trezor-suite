import { isValidProtocol } from '../libs/protocol';
import protocols from '../uriSchemes.json';

describe('isValidProtocol', () => {
    test('should return true for valid protocols', () => {
        expect(isValidProtocol('bitcoin:example', protocols)).toBe(true);
        expect(isValidProtocol('litecoin:example', protocols)).toBe(true);
        expect(isValidProtocol('trezorsuite:example', protocols)).toBe(true);
    });

    test('should return false for invalid protocols', () => {
        expect(isValidProtocol('ledger:example', protocols)).toBe(false);
        expect(isValidProtocol('bnb:example', protocols)).toBe(false);
    });

    test('should return false for non-protocol strings', () => {
        expect(isValidProtocol('www.example.com', protocols)).toBe(false);
        expect(isValidProtocol('example.com', protocols)).toBe(false);
        expect(isValidProtocol('random-string', protocols)).toBe(false);
    });
});
