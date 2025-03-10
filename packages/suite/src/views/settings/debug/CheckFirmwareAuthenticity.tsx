import React, { useState } from 'react';

import { Button, Switch } from '@trezor/components';
import { ActionColumn, SectionItem, TextColumn } from 'src/components/suite/Settings';
import { useFirmware, useActions, useSelector } from 'src/hooks/suite';
import * as suiteActions from 'src/actions/suite/suiteActions';

export const CheckFirmwareAuthenticity = () => {
    const [inProgress, setInProgress] = useState(false);

    const { checkFirmwareAuthenticity } = useFirmware();
    const { setDebugMode } = useActions({
        setDebugMode: suiteActions.setDebugMode,
    });
    const { debug } = useSelector(state => ({
        debug: state.suite.settings.debug,
    }));

    const onChangeRegularCheck = (state?: boolean) => {
        setDebugMode({
            checkFirmwareAuthenticity: state,
        });
    };

    const onCheckFirmwareAuthenticity = async () => {
        setInProgress(true);
        await checkFirmwareAuthenticity();
        setInProgress(false);
    };

    return (
        <>
            <SectionItem data-test="@settings/debug/check-firmware-authenticity">
                <TextColumn
                    title="Check firmware authenticity"
                    description="Download firmware binary from data.trezor.io and compare its hash with firmware hash provided by Trezor device."
                />
                <ActionColumn>
                    <Button
                        onClick={onCheckFirmwareAuthenticity}
                        isLoading={inProgress}
                        isDisabled={inProgress}
                    >
                        Check
                    </Button>
                </ActionColumn>
            </SectionItem>
            <SectionItem data-test="@settings/debug/check-firmware-authenticity-on-connect/switch">
                <TextColumn
                    title="Check firmware authenticity regularly"
                    description="Carry out firmware authenticity check every time you authorize Trezor device"
                />
                <ActionColumn>
                    <Switch
                        onChange={onChangeRegularCheck}
                        isChecked={!!debug.checkFirmwareAuthenticity}
                    />
                </ActionColumn>
            </SectionItem>
        </>
    );
};
