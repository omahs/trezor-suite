import React from 'react';
import { OnboardingButtonCta } from 'src/components/onboarding';
import { SelectWordCount, SelectRecoveryType, SelectRecoveryWord } from 'src/components/recovery';
import { Translation } from 'src/components/suite';
import * as onboardingActions from 'src/actions/onboarding/onboardingActions';
import { useActions, useRecovery, useSelector } from 'src/hooks/suite';
import RecoveryStepBox from './RecoveryStepBox';
import { DeviceModel, getDeviceModel, pickByDeviceModel } from '@trezor/device-utils';
import { selectIsActionAbortable } from 'src/reducers/suite/suiteReducer';
import styled from 'styled-components';

const InProgressRecoveryStepBox = styled(RecoveryStepBox)<{ deviceModel: DeviceModel }>`
    ${({ deviceModel }) => (deviceModel === DeviceModel.T1 ? 'min-height: 475px' : '')};
`;

export const RecoveryStep = () => {
    const { goToNextStep, updateAnalytics } = useActions({
        goToNextStep: onboardingActions.goToNextStep,
        updateAnalytics: onboardingActions.updateAnalytics,
    });

    const isActionAbortable = useSelector(selectIsActionAbortable);

    const { device } = useSelector(state => ({
        device: state.suite.device,
    }));

    const {
        status,
        error,
        wordRequestInputType,
        setWordsCount,
        setAdvancedRecovery,
        recoverDevice,
        setStatus,
        resetReducer,
    } = useRecovery();

    if (!device || !device.features) {
        return null;
    }

    const deviceModel = getDeviceModel(device);

    if (status === 'initial') {
        // 1. step where users chooses number of words in case of T1
        // In case of TT and model T2B1 show CTA button to start the process
        if (deviceModel === DeviceModel.T1) {
            // T1
            return (
                <RecoveryStepBox
                    key={status} // to properly rerender in translation mode
                    heading={<Translation id="TR_RECOVER_YOUR_WALLET_FROM" />}
                    description={<Translation id="TR_RECOVER_SUBHEADING_COMPUTER" />}
                >
                    <SelectWordCount
                        onSelect={number => {
                            setWordsCount(number);
                            setStatus('select-recovery-type');
                        }}
                    />
                </RecoveryStepBox>
            );
        }

        // TT and T2B1
        return (
            <RecoveryStepBox
                key={status} // to properly rerender in translation mode
                heading={<Translation id="TR_RECOVER_YOUR_WALLET_FROM" />}
                description={
                    <Translation
                        id={pickByDeviceModel(deviceModel, {
                            default: 'TR_RECOVER_SUBHEADING_TOUCH',
                            [DeviceModel.TT]: 'TR_RECOVER_SUBHEADING_TOUCH',
                            [DeviceModel.T2B1]: 'TR_RECOVER_SUBHEADING_BUTTONS',
                        })}
                    />
                }
                innerActions={
                    <OnboardingButtonCta
                        data-test="@onboarding/recovery/start-button"
                        onClick={recoverDevice}
                    >
                        <Translation id="TR_START_RECOVERY" />
                    </OnboardingButtonCta>
                }
            />
        );
    }

    if (status === 'select-recovery-type') {
        // 2. step: Standard recovery (user enters recovery seed word by word on host) or Advanced recovery (user types words on a device)
        return (
            <RecoveryStepBox
                key={status} // to properly rerender in translation mode
                heading={<Translation id="TR_SELECT_RECOVERY_METHOD" />}
                description={<Translation id="TR_RECOVERY_TYPES_DESCRIPTION" />}
            >
                <SelectRecoveryType
                    onSelect={(type: 'standard' | 'advanced') => {
                        setAdvancedRecovery(type === 'advanced');
                        updateAnalytics({ recoveryType: type });
                        recoverDevice();
                    }}
                />
            </RecoveryStepBox>
        );
    }

    if (status === 'waiting-for-confirmation') {
        // On T1 we show confirm bubble only while we wait for confirmation that users wants to start the process
        return (
            <RecoveryStepBox
                key={status} // to properly rerender in translation mode
                heading={<Translation id="TR_RECOVER_YOUR_WALLET_FROM" />}
                description={pickByDeviceModel(deviceModel, {
                    default: undefined,
                    [DeviceModel.TT]: <Translation id="TR_RECOVER_SUBHEADING_TOUCH" />,
                    [DeviceModel.T2B1]: <Translation id="TR_RECOVER_SUBHEADING_BUTTONS" />,
                })}
                deviceModel={deviceModel}
                isActionAbortable={isActionAbortable}
            />
        );
    }

    if (status === 'in-progress') {
        const getModel1Description = () => {
            if (wordRequestInputType === 'plain') {
                return (
                    <>
                        <Translation id="TR_ENTER_SEED_WORDS_INSTRUCTION" />{' '}
                        <Translation id="TR_RANDOM_SEED_WORDS_DISCLAIMER" />
                    </>
                );
            }

            if (wordRequestInputType === 6 || wordRequestInputType === 9) {
                return <Translation id="TR_ADVANCED_RECOVERY_TEXT" />;
            }
        };

        return (
            <InProgressRecoveryStepBox
                key={status} // to properly rerender in translation mode
                heading={<Translation id="TR_RECOVER_YOUR_WALLET_FROM" />}
                deviceModel={deviceModel}
                description={pickByDeviceModel(deviceModel, {
                    default: undefined,
                    [DeviceModel.T1]: getModel1Description(),
                    [DeviceModel.TT]: <Translation id="TR_RECOVER_SUBHEADING_TOUCH" />,
                    [DeviceModel.T2B1]: <Translation id="TR_RECOVER_SUBHEADING_BUTTONS" />,
                })}
                isActionAbortable
            >
                <SelectRecoveryWord />
            </InProgressRecoveryStepBox>
        );
    }

    if (device && device.mode === 'normal') {
        // Ready to continue to the next step
        return (
            <RecoveryStepBox
                key={status} // to properly rerender in translation mode
                heading={<Translation id="TR_WALLET_RECOVERED_FROM_SEED" />}
                innerActions={
                    <OnboardingButtonCta
                        data-test="@onboarding/recovery/continue-button"
                        onClick={() => goToNextStep('set-pin')}
                    >
                        <Translation id="TR_CONTINUE" />
                    </OnboardingButtonCta>
                }
            />
        );
    }
    if (status === 'finished' && error) {
        // Recovery finished with error, user is recommended to wipe the device and start over
        return (
            <RecoveryStepBox
                key={status} // to properly rerender in translation mode
                heading={<Translation id="TR_RECOVERY_FAILED" />}
                description={<Translation id="TR_RECOVERY_ERROR" values={{ error }} />}
                innerActions={
                    <OnboardingButtonCta
                        data-test="@onboarding/recovery/retry-button"
                        onClick={deviceModel === DeviceModel.T1 ? resetReducer : recoverDevice}
                    >
                        <Translation id="TR_RETRY" />
                    </OnboardingButtonCta>
                }
            />
        );
    }

    // We shouldn't get there, but to keep typescript sane let's return null
    return null;
};
