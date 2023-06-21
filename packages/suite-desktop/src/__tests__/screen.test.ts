import { screen } from 'electron';

import {
    getInitialWindowSize,
    MIN_WIDTH,
    MIN_HEIGHT,
    MAX_WIDTH,
    MAX_HEIGHT,
    WINDOW_SIZE_FACTOR,
} from '../libs/screen';

jest.mock('electron', () => ({
    screen: {
        getPrimaryDisplay: jest.fn(),
    },
}));

const mockedGetPrimaryDisplay = screen.getPrimaryDisplay as jest.Mock;

describe('getInitialWindowSize', () => {
    test('should return minimum size when screen size is very small', () => {
        mockedGetPrimaryDisplay.mockReturnValue({
            bounds: { width: 1, height: 1 },
        });

        const { width, height } = getInitialWindowSize();
        expect(width).toBe(MIN_WIDTH);
        expect(height).toBe(MIN_HEIGHT);
    });

    test('should return maximum size when screen size is very large', () => {
        mockedGetPrimaryDisplay.mockReturnValue({
            bounds: { width: 10000, height: 10000 },
        });

        const { width, height } = getInitialWindowSize();
        expect(width).toBe(MAX_WIDTH);
        expect(height).toBe(MAX_HEIGHT);
    });

    test('should return calculated size when screen size is moderate', () => {
        const moderateWidth = 1600;
        const moderateHeight = 900;
        mockedGetPrimaryDisplay.mockReturnValue({
            bounds: { width: moderateWidth, height: moderateHeight },
        });

        const { width, height } = getInitialWindowSize();
        expect(width).toBe(Math.floor(moderateWidth * WINDOW_SIZE_FACTOR));
        expect(height).toBe(Math.floor(moderateHeight * WINDOW_SIZE_FACTOR));
    });
});
