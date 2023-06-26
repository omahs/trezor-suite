import { getOsTheme } from '../env';

describe('getOsTheme', () => {
    it('should return "dark" when dark theme query matches', () => {
        const matchMediaMock = jest.fn().mockReturnValueOnce({ matches: true });
        window.matchMedia = matchMediaMock;
        expect(getOsTheme()).toBe('dark');
    });

    it('should return "light" when dark theme query does not match', () => {
        const matchMediaMock = jest.fn().mockReturnValueOnce({ matches: false });
        window.matchMedia = matchMediaMock;
        expect(getOsTheme()).toBe('light');
    });
});
