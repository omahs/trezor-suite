import React, { useState } from 'react';
import styled from 'styled-components';
import { DATA_URL, HELP_CENTER_TOR_URL, GITHUB_BRIDGE_CHANGELOG_URL } from '@trezor/urls';
import { Translation, TrezorLink, Modal, Metadata } from 'src/components/suite';
import { Button, P, Link, Select, Image, useTheme, variables, Loader } from '@trezor/components';
import * as routerActions from 'src/actions/suite/routerActions';
import { isDesktop, isWeb } from '@trezor/env-utils';
import { useSelector, useActions } from 'src/hooks/suite';
import { selectTorState } from 'src/reducers/suite/suiteReducer';
import { DeviceModel } from '@trezor/device-utils';

const Content = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    flex: 1;
    padding: 0px 74px;
    /* min-width: 560px; */

    @media screen and (max-width: ${variables.SCREEN_SIZE.SM}) {
        padding: 0px;
        min-width: 0px;
    }
`;

const Footer = styled.div`
    margin-top: 72px;
    display: flex;
    padding: 0px 42px;
    justify-content: space-between;
    width: 100%;

    @media screen and (max-width: ${variables.SCREEN_SIZE.SM}) {
        padding: 0px 12px;
    }
`;

const SelectWrapper = styled(Select)`
    width: 100%;
`;

const Download = styled.div`
    margin: 24px auto;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
`;

const DownloadBridgeButton = styled(Button)`
    margin-top: 12px;
    min-width: 280px;
`;

const CenteredLoader = styled(Loader)`
    margin: 0 auto;
    margin-bottom: 10px;
`;

const LoaderWrapper = styled.div`
    margin: 15px 0 25px 0;
    align-items: center;
    /* same height as content so it won't feel jumpy */
    min-height: 98px;
    justify-items: center;
`;

const Version = styled.div<{ show: boolean }>`
    visibility: ${props => (props.show ? 'visible' : 'hidden')};
    margin-top: 10px;
    font-size: ${variables.FONT_SIZE.SMALL};
`;

const BridgeDesktopNote = styled(P)`
    margin-top: 10px;
    font-size: ${variables.FONT_SIZE.TINY};
`;

const StyledImage = styled(Image)`
    @media screen and (max-height: ${variables.SCREEN_SIZE.LG}) {
        /* workaround for low height screens => hide image */
        display: none;
    }
`;

const Col = styled.div<{ justify?: string }>`
    display: flex;
    flex: 1;
    justify-content: ${props => props.justify};
`;

interface Installer {
    label: string;
    value: string;
    signature?: string;
    preferred?: boolean;
}

export const InstallBridge = () => {
    const { isTorEnabled } = useSelector(selectTorState);
    const transport = useSelector(state => state.suite.transport);
    const [selectedTarget, setSelectedTarget] = useState<Installer | null>(null);

    const theme = useTheme();
    const actions = useActions({
        goto: routerActions.goto,
    });

    const installers: Installer[] =
        transport && transport.bridge
            ? transport.bridge.packages.map(p => ({
                  label: p.name,
                  value: p.url,
                  signature: p.signature,
                  preferred: p.preferred,
              }))
            : [];

    const preferredTarget = installers.find(i => i.preferred === true);
    const data = {
        currentVersion: transport?.type === 'BridgeTransport' ? transport!.version : null,
        latestVersion: transport?.bridge ? transport.bridge.version.join('.') : null,
        installers,
        target: preferredTarget || installers[0],
        uri: DATA_URL,
    };

    const target = selectedTarget || data.target;
    const isLoading = !transport;
    const transportAvailable = transport && transport.type;

    return (
        <Modal
            heading={<Translation id="TR_TREZOR_BRIDGE_DOWNLOAD" />}
            description={<Translation id="TR_NEW_COMMUNICATION_TOOL" />}
            data-test="@modal/bridge"
        >
            <Metadata title="Download Bridge | Trezor Suite" />
            <Content>
                <Version show={!!data.currentVersion}>
                    <Translation
                        id="TR_CURRENTLY_INSTALLED_TREZOR"
                        values={{ version: data.currentVersion }}
                    />
                    {isDesktop() && (
                        <BridgeDesktopNote>
                            <Translation id="TR_OUTDATED_BRIDGE_DESKTOP" />
                        </BridgeDesktopNote>
                    )}
                </Version>
                <StyledImage image={`BRIDGE_CHECK_TREZOR_T${DeviceModel.TT}`} />
                {isLoading ? (
                    <LoaderWrapper data-test="@bridge/loading">
                        <CenteredLoader size={50} strokeWidth={2} />
                        <P>
                            <Translation id="TR_GATHERING_INFO" />
                        </P>
                    </LoaderWrapper>
                ) : (
                    <Download>
                        <SelectWrapper
                            isSearchable={false}
                            isClearable={false}
                            value={target}
                            onChange={setSelectedTarget}
                            options={installers}
                            maxMenuHeight={160}
                            data-test="@bridge/installers"
                        />

                        <TrezorLink variant="nostyle" href={`${data.uri}${target.value}`}>
                            <DownloadBridgeButton data-test="@bridge/download-button">
                                <Translation
                                    id="TR_DOWNLOAD_LATEST_BRIDGE"
                                    values={{ version: data.latestVersion }}
                                />
                            </DownloadBridgeButton>
                        </TrezorLink>
                    </Download>
                )}
                {isWeb() && isTorEnabled && (
                    <P>
                        <TrezorLink href={HELP_CENTER_TOR_URL}>
                            <Translation id="TR_TOR_BRIDGE" />
                        </TrezorLink>
                    </P>
                )}
            </Content>

            <Footer>
                {transportAvailable && (
                    <Col justify="flex-start">
                        <Button
                            icon="ARROW_LEFT"
                            variant="tertiary"
                            color={theme.TYPE_LIGHT_GREY}
                            onClick={() => actions.goto('wallet-index')}
                            data-test="@bridge/goto/wallet-index"
                        >
                            <Translation id="TR_TAKE_ME_BACK_TO_WALLET" />
                        </Button>
                    </Col>
                )}
                {!isLoading && (
                    <>
                        <Col justify="center">
                            <Link variant="nostyle" href={GITHUB_BRIDGE_CHANGELOG_URL}>
                                <Button
                                    icon="LOG"
                                    color={theme.TYPE_LIGHT_GREY}
                                    variant="tertiary"
                                    onClick={() => {}}
                                >
                                    <Translation id="TR_CHANGELOG" />
                                </Button>
                            </Link>
                        </Col>
                        <Col justify="flex-end">
                            {data && target?.signature && (
                                <TrezorLink variant="nostyle" href={data.uri + target.signature}>
                                    <Button
                                        color={theme.TYPE_LIGHT_GREY}
                                        icon="SIGNATURE"
                                        variant="tertiary"
                                        onClick={() => {}}
                                    >
                                        <Translation id="TR_CHECK_PGP_SIGNATURE" />
                                    </Button>
                                </TrezorLink>
                            )}
                        </Col>
                    </>
                )}
            </Footer>
        </Modal>
    );
};
