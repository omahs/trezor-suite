import React from 'react';
import { analytics, EventType } from '@trezor/suite-analytics';

import { Translation } from 'src/components/suite';
import { ActionColumn, ActionSelect, SectionItem, TextColumn } from 'src/components/suite/Settings';
import { useActions, useDevice, useLocales } from 'src/hooks/suite';
import * as deviceSettingsActions from 'src/actions/settings/deviceSettingsActions';
import { formatDurationStrict } from '@suite-common/suite-utils';
import { useAnchor } from 'src/hooks/suite/useAnchor';
import { SettingsAnchor } from 'src/constants/suite/anchors';

// auto lock times in seconds; allowed lock times by device: <1 minute, 6 days>
const AUTO_LOCK_TIMES = {
    '1_MINUTE': 60,
    '10_MINUTES': 60 * 10,
    '1_HOUR': 60 * 60,
    '1_DAY': 60 * 60 * 24,
    '6_DAYS': 60 * 60 * 24 * 6,
} as const;

const buildAutoLockOption = (seconds: number, locale?: Locale) => ({
    label: formatDurationStrict(seconds, locale),
    value: seconds,
});

interface AutoLockProps {
    isDeviceLocked: boolean;
}

export const AutoLock = ({ isDeviceLocked }: AutoLockProps) => {
    const { applySettings } = useActions({
        applySettings: deviceSettingsActions.applySettings,
    });
    const { anchorRef, shouldHighlight } = useAnchor(SettingsAnchor.Autolock);

    const { device } = useDevice();
    const locale = useLocales();

    const autoLockDelay = device?.features?.auto_lock_delay_ms;

    if (typeof autoLockDelay !== 'number') {
        return null;
    }

    const AUTO_LOCK_OPTIONS = {
        label: <Translation id="TR_DEVICE_SETTINGS_AFTER_DELAY" />,
        options: Object.values(AUTO_LOCK_TIMES).map(time => buildAutoLockOption(time, locale)),
    };

    return (
        <SectionItem
            data-test="@settings/device/autolock"
            ref={anchorRef}
            shouldHighlight={shouldHighlight}
        >
            <TextColumn
                title={<Translation id="TR_DEVICE_SETTINGS_AUTO_LOCK" />}
                description={<Translation id="TR_DEVICE_SETTINGS_AUTO_LOCK_SUBHEADING" />}
            />
            <ActionColumn>
                <ActionSelect
                    hideTextCursor
                    useKeyPressScroll
                    placeholder=""
                    onChange={(option: { value: number; label: string }) => {
                        const value = option.value * 1000;

                        applySettings({
                            auto_lock_delay_ms: value,
                        });
                        analytics.report({
                            type: EventType.SettingsDeviceUpdateAutoLock,
                            payload: {
                                value,
                            },
                        });
                    }}
                    options={[AUTO_LOCK_OPTIONS]}
                    value={AUTO_LOCK_OPTIONS.options.find(
                        option => autoLockDelay && autoLockDelay / 1000 === option.value,
                    )}
                    isDisabled={isDeviceLocked}
                    data-test="@settings/auto-lock-select"
                />
            </ActionColumn>
        </SectionItem>
    );
};
