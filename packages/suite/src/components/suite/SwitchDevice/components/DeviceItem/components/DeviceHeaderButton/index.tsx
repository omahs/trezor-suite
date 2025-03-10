import React from 'react';
import styled from 'styled-components';
import { useTheme, Icon } from '@trezor/components';
import { Translation } from 'src/components/suite';
import NotificationCard from 'src/components/suite/NotificationCard'; // on purpose to avoid hacky sc overriding
import * as deviceUtils from 'src/utils/suite/device';
import { TrezorDevice } from 'src/types/suite';

const GrayNotificationCard = styled(NotificationCard)`
    background: ${props => props.theme.BG_GREY};
    margin-bottom: 0px;
`;
interface Props {
    needsAttention: boolean;
    device: TrezorDevice;
    onSolveIssueClick: () => void;
    onDeviceSettingsClick: () => void;
}

const DeviceHeaderButton = (props: Props) => {
    const { device } = props;
    const theme = useTheme();
    const deviceStatus = deviceUtils.getStatus(device);
    const deviceStatusMessage = deviceUtils.getDeviceNeedsAttentionMessage(deviceStatus);
    const isUnknown = device.type !== 'acquired';

    return (
        <>
            {props.needsAttention && (
                <GrayNotificationCard
                    variant="warning"
                    button={{
                        children: <Translation id="TR_SOLVE_ISSUE" />,
                        onClick: props.onSolveIssueClick,
                        'data-test': `@switch-device/${device.path}/solve-issue-button`,
                    }}
                >
                    {deviceStatusMessage && <Translation id={deviceStatusMessage} />}
                </GrayNotificationCard>
            )}
            {!props.needsAttention && !isUnknown && (
                // Device Settings button
                <Icon
                    useCursorPointer
                    size={24}
                    icon="SETTINGS"
                    color={theme.TYPE_LIGHT_GREY}
                    hoverColor={theme.TYPE_LIGHTER_GREY}
                    onClick={props.onDeviceSettingsClick}
                />
            )}
        </>
    );
};

export default DeviceHeaderButton;
