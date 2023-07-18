import React from 'react';
import { useSelector } from 'react-redux';

import { G } from '@mobily/ts-belt';

import { Icon } from '@suite-common/icons';
import { AccountKey } from '@suite-common/wallet-types';
import { Box, Text, VStack } from '@suite-native/atoms';
import { FiatRatesRootState } from '@suite-native/fiat-rates';
import { TransactionsRootState } from '@suite-common/wallet-core';
import { SettingsSliceRootState } from '@suite-native/module-settings';

import { TransactionDetailSheet } from './TransactionDetailSheet';
import { selectTransactionInputAndOutputTransfers } from '../../selectors';
import { TransactionDetailInputsSheetSection } from './TransactionDetailInputsSheetSection';

type TransactionDetailInputsSheetProps = {
    isVisible: boolean;
    txid: string;
    accountKey: AccountKey;
    onSheetVisibilityChange: () => void;
};

type InputsOutputsMainHeader = {
    inputsCounts: number;
    outputsCount: number;
};

const InputsOutputsMainHeader = ({ inputsCounts, outputsCount }: InputsOutputsMainHeader) => (
    <Box flexDirection="row" justifyContent="space-between" marginBottom="medium">
        <Box flex={1} flexDirection="row" alignItems="center" paddingLeft="small">
            <Text variant="hint" color="textSubdued">
                Inputs · {inputsCounts}
            </Text>
            <Box marginLeft="small">
                <Icon name="receiveAlt" color="iconSubdued" size="medium" />
            </Box>
        </Box>

        <Box flex={1} flexDirection="row" alignItems="center" paddingLeft="large">
            <Text variant="hint" color="textSubdued">
                Outputs · {outputsCount}
            </Text>
            <Box marginLeft="small">
                <Icon name="sendAlt" color="iconSubdued" size="medium" />
            </Box>
        </Box>
    </Box>
);

export const TransactionDetailInputsSheet = ({
    isVisible,
    onSheetVisibilityChange,
    txid,
    accountKey,
}: TransactionDetailInputsSheetProps) => {
    const transactionTransfers = useSelector(
        (state: TransactionsRootState & FiatRatesRootState & SettingsSliceRootState) =>
            selectTransactionInputAndOutputTransfers(state, txid, accountKey),
    );

    if (G.isNull(transactionTransfers)) return null;
    const { externalTransfers, internalTransfers, tokenTransfers } = transactionTransfers;
    const inputsCount = externalTransfers.reduce((sum, { inputs }) => sum + inputs.length, 0);
    const outputsCount = externalTransfers.reduce((sum, { outputs }) => sum + outputs.length, 0);

    return (
        <TransactionDetailSheet
            isVisible={isVisible}
            onVisibilityChange={onSheetVisibilityChange}
            title="Inputs & Outputs"
            iconName="swap"
            transactionId={txid}
        >
            <VStack>
                <TransactionDetailInputsSheetSection
                    header={
                        <InputsOutputsMainHeader
                            inputsCounts={inputsCount}
                            outputsCount={outputsCount}
                        />
                    }
                    transfers={externalTransfers}
                />

                <TransactionDetailInputsSheetSection
                    header="Internal Transfers"
                    transfers={internalTransfers}
                />

                <TransactionDetailInputsSheetSection
                    header="Token Transfers"
                    transfers={tokenTransfers}
                />
            </VStack>
        </TransactionDetailSheet>
    );
};
