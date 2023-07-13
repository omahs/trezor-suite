import { memoizeWithArgs } from 'proxy-memoize';
import { G } from '@mobily/ts-belt';

import {
    selectTransactionByTxidAndAccountKey,
    selectTransactionTargets,
    TransactionsRootState,
} from '@suite-common/wallet-core';
import { AccountKey } from '@suite-common/wallet-types';

import { mapTransactionInputsOutputsToAddresses, sortTargetAddressesToBeginning } from './utils';
import { AddressesType, VinVoutAddress } from './types';

const selectTransactionTargetAddresses = memoizeWithArgs(
    (state: TransactionsRootState, txid: string, accountKey: AccountKey) => {
        const transaction = selectTransactionByTxidAndAccountKey(state, txid, accountKey);

        const transactionTargets = selectTransactionTargets(state, txid, accountKey);
        if (G.isNullable(transaction) || G.isNullable(transactionTargets)) return [];

        const isSentTransactionType = transaction.type === 'sent';
        return mapTransactionInputsOutputsToAddresses(
            transactionTargets,
            'outputs',
            isSentTransactionType,
        );
    },
    { size: 50 },
);

export const selectTransactionAddresses = memoizeWithArgs(
    (
        state: TransactionsRootState,
        txid: string,
        accountKey: AccountKey,
        addressesType: AddressesType,
    ): VinVoutAddress[] => {
        const transaction = selectTransactionByTxidAndAccountKey(state, txid, accountKey);

        if (G.isNullable(transaction)) return [];

        const inputsOrOutputs =
            addressesType === 'inputs' ? transaction.details.vin : transaction.details.vout;

        const isSentTransactionType = transaction.type === 'sent';

        const addresses = mapTransactionInputsOutputsToAddresses(
            inputsOrOutputs,
            addressesType,
            isSentTransactionType,
        );

        const targetAddresses = selectTransactionTargetAddresses(state, txid, accountKey);

        return sortTargetAddressesToBeginning(addresses, targetAddresses);
    },
    { size: 100 },
);
