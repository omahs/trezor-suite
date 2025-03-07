import React, { ReactNode, useEffect } from 'react';
import Animated, {
    SlideOutUp,
    useAnimatedGestureHandler,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
    EntryAnimationsValues,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { TouchableWithoutFeedback } from 'react-native';

import { prepareNativeStyle, useNativeStyles } from '@trezor/styles';
import { Box, Text } from '@suite-native/atoms';
import { InvertedThemeProvider } from '@suite-native/theme';

type NotificationProps = {
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    title: string;
    description: ReactNode;
    onPress: () => void;
    onHide: () => void;
    isHiddenAutomatically?: boolean;
};

const DISMISS_THRESHOLD = -25;
const HIDDEN_OFFSET = -200;

const ENTER_ANIMATION_DURATION = 1000;
const EXIT_ANIMATION_DURATION = 1000;
const NOTIFICATION_VISIBLE_DURATION = 5000 + ENTER_ANIMATION_DURATION + EXIT_ANIMATION_DURATION;

const notificationContainerStyle = prepareNativeStyle(utils => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: utils.spacings.small / 2,
    borderRadius: utils.borders.radii.round,
    backgroundColor: utils.colors.backgroundNeutralBold,
    paddingHorizontal: utils.spacings.small / 2,
    ...utils.boxShadows.small,
}));

export const Notification = ({
    iconLeft,
    iconRight,
    title,
    description,
    onPress,
    onHide,
    isHiddenAutomatically = true,
}: NotificationProps) => {
    const { applyStyle } = useNativeStyles();

    const translateY = useSharedValue(0);

    const onSwipeGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
        onActive: event => {
            if (event.translationY <= 0) translateY.value = event.translationY;
        },
        onEnd: event => {
            if (event.translationY < DISMISS_THRESHOLD) {
                translateY.value = withTiming(HIDDEN_OFFSET, undefined, isFinished => {
                    if (isFinished) runOnJS(onHide)();
                });
            } else {
                translateY.value = withTiming(0);
            }
        },
    });

    useEffect(() => {
        const timeout = setTimeout(
            () => isHiddenAutomatically && onHide(),
            NOTIFICATION_VISIBLE_DURATION,
        );
        return () => clearTimeout(timeout);
    }, [isHiddenAutomatically, onHide]);

    const swipeGestureStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: translateY.value,
            },
        ],
    }));

    const runEnteringAnimation = (_: EntryAnimationsValues) => {
        'worklet';

        const animations = {
            originY: withTiming(0, { duration: ENTER_ANIMATION_DURATION }),
            opacity: withTiming(1, { duration: ENTER_ANIMATION_DURATION }),
        };
        const initialValues = {
            originY: HIDDEN_OFFSET,
            opacity: 0,
        };
        return {
            initialValues,
            animations,
        };
    };

    return (
        <InvertedThemeProvider>
            <PanGestureHandler onGestureEvent={onSwipeGesture}>
                <Animated.View
                    style={swipeGestureStyle}
                    entering={runEnteringAnimation}
                    exiting={SlideOutUp.duration(EXIT_ANIMATION_DURATION)}
                >
                    <TouchableWithoutFeedback onPress={onPress}>
                        <Box style={applyStyle(notificationContainerStyle)}>
                            <Box flexDirection="row">
                                {iconLeft}
                                <Box marginLeft="medium">
                                    <Text>{title}</Text>
                                    {description}
                                </Box>
                            </Box>
                            <Box marginRight="small">{iconRight}</Box>
                        </Box>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </PanGestureHandler>
        </InvertedThemeProvider>
    );
};
