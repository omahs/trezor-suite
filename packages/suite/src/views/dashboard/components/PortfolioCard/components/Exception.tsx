import React from 'react';

import styled from 'styled-components';
import { Translation } from 'src/components/suite';
import { useDevice, useActions } from 'src/hooks/suite';
import * as discoveryActions from 'src/actions/wallet/discoveryActions';
import * as deviceSettingsActions from 'src/actions/settings/deviceSettingsActions';
import * as suiteActions from 'src/actions/suite/suiteActions';
import * as modalActions from 'src/actions/suite/modalActions';
import * as routerActions from 'src/actions/suite/routerActions';
import type { Discovery, DiscoveryStatusType } from 'src/types/wallet';

import * as accountUtils from '@suite-common/wallet-utils';
import { variables, Button, IconProps, H3, Image } from '@trezor/components';

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 20px;
    width: 100%;
`;

const Title = styled(H3)`
    color: ${props => props.theme.TYPE_DARK_GREY};
`;

const Description = styled.div`
    font-size: ${variables.FONT_SIZE.SMALL};
    color: ${props => props.theme.TYPE_LIGHT_GREY};
    text-align: center;
`;

const StyledImage = styled(props => <Image {...props} />)`
    margin: 24px 0px;
`;

const Actions = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-top: 24px;
`;

interface CTA {
    label?: React.ComponentProps<typeof Translation>['id'];
    variant?: React.ComponentProps<typeof Button>['variant'];
    action: () => void;
    icon?: IconProps['icon'];
}

interface ContainerProps {
    title: React.ComponentProps<typeof Translation>['id'];
    description: React.ComponentProps<typeof Translation>['id'] | JSX.Element;
    cta: CTA | CTA[];
    dataTestBase: string;
}

// Common wrapper for all views
const Container = ({ title, description, cta, dataTestBase }: ContainerProps) => {
    const { isLocked } = useDevice();
    const actions = Array.isArray(cta) ? cta : [cta];
    return (
        <Wrapper data-test={`@exception/${dataTestBase}`}>
            <StyledImage image="UNI_ERROR" />
            <Title>
                <Translation id={title} />
            </Title>
            <Description>
                {typeof description === 'string' ? <Translation id={description} /> : description}
            </Description>
            <Actions>
                {actions.map(a => (
                    <Button
                        key={a.label || 'TR_RETRY'}
                        variant={a.variant || 'primary'}
                        icon={a.icon || 'PLUS'}
                        isLoading={isLocked()}
                        onClick={a.action}
                        data-test={`@exception/${dataTestBase}/${a.variant || 'primary'}-button`}
                    >
                        <Translation id={a.label || 'TR_RETRY'} />
                    </Button>
                ))}
            </Actions>
        </Wrapper>
    );
};

interface ExceptionProps {
    exception: Extract<DiscoveryStatusType, { status: 'exception' }>;
    discovery?: Discovery;
}

const discoveryFailedMessage = (discovery?: Discovery) => {
    if (!discovery) return '';
    if (discovery.error) return <div>{discovery.error}</div>;
    // group all failed networks into array of errors
    const networkError: string[] = [];
    const details = discovery.failed.reduce((value, account) => {
        const n = accountUtils.getNetwork(account.symbol)!;
        if (networkError.includes(account.symbol)) return value;
        networkError.push(account.symbol);
        return value.concat(
            <div key={account.symbol}>
                {n.name}: {account.error}
            </div>,
        );
    }, [] as JSX.Element[]);
    return <>{details}</>;
};

export const Exception = ({ exception, discovery }: ExceptionProps) => {
    const { device } = useDevice();
    const actions = useActions({
        authorizeDevice: suiteActions.authorizeDevice,
        authConfirm: suiteActions.authConfirm,
        goto: routerActions.goto,
        openModal: modalActions.openModal,
        restartDiscovery: discoveryActions.restart,
        applySettings: deviceSettingsActions.applySettings,
    });
    switch (exception.type) {
        case 'auth-failed':
            return (
                <Container
                    title="TR_ACCOUNT_EXCEPTION_AUTH_ERROR"
                    description="TR_ACCOUNT_EXCEPTION_AUTH_ERROR_DESC"
                    cta={{ action: actions.authorizeDevice }}
                    dataTestBase={exception.type}
                />
            );
        case 'auth-confirm-failed':
            return (
                <Container
                    title="TR_AUTH_CONFIRM_FAILED_TITLE"
                    description="TR_AUTH_CONFIRM_FAILED_DESC"
                    cta={{ action: actions.authConfirm }}
                    dataTestBase={exception.type}
                />
            );
        case 'discovery-empty':
            return (
                <Container
                    title="TR_ACCOUNT_EXCEPTION_DISCOVERY_EMPTY"
                    description="TR_ACCOUNT_EXCEPTION_DISCOVERY_EMPTY_DESC"
                    cta={[
                        {
                            action: () => actions.goto('settings-coins'),
                            variant: 'secondary',
                            icon: 'SETTINGS',
                            label: 'TR_COIN_SETTINGS',
                        },
                        {
                            action: () =>
                                actions.openModal({
                                    type: 'add-account',
                                    device: device!,
                                }),
                            label: 'TR_ADD_ACCOUNT',
                        },
                    ]}
                    dataTestBase={exception.type}
                />
            );
        case 'discovery-failed':
            return (
                <Container
                    title="TR_DASHBOARD_DISCOVERY_ERROR"
                    description={
                        <Translation
                            id="TR_DASHBOARD_DISCOVERY_ERROR_PARTIAL_DESC"
                            values={{ details: discoveryFailedMessage(discovery) }}
                        />
                    }
                    cta={{ action: actions.restartDiscovery, icon: 'REFRESH' }}
                    dataTestBase={exception.type}
                />
            );
        case 'device-unavailable':
            return (
                <Container
                    title="TR_DASHBOARD_DISCOVERY_ERROR"
                    description={
                        <Translation
                            id="TR_ACCOUNT_PASSPHRASE_DISABLED"
                            values={{ details: discoveryFailedMessage(discovery) }}
                        />
                    }
                    cta={{
                        action: async () => {
                            // enable passphrase
                            const result = await actions.applySettings({ use_passphrase: true });
                            if (!result || !result.success) return;
                            // restart discovery
                            actions.restartDiscovery();
                        },
                        label: 'TR_ACCOUNT_ENABLE_PASSPHRASE',
                    }}
                    dataTestBase={exception.type}
                />
            );
        default:
            return null;
    }
};
