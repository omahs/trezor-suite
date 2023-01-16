import { useEffect, useMemo } from 'react';
import { UseFormMethods } from 'react-hook-form';

import { UseSendFormState } from '@suite-common/wallet-types';
import type { AccountUtxo, PROTO } from '@trezor/connect';
import { getUtxoOutpoint } from '@suite-common/wallet-utils';

type Props = UseFormMethods &
    Pick<UseSendFormState, 'account' | 'composedLevels' | 'excludedUtxos'> & {
        composeRequest: (field?: string) => void;
    };

export const useUtxoSelection = ({
    account,
    composedLevels,
    composeRequest,
    excludedUtxos,
    register,
    setValue,
    watch,
}: Props) => {
    // register custom form field (without HTMLElement)
    useEffect(() => {
        register({ name: 'isCoinControlEnabled', type: 'custom' });
        register({ name: 'selectedUtxos', type: 'custom' });
        register({ name: 'anonymityWarningChecked', type: 'custom' });
    }, [register]);

    const canBeSelected = (utxo: AccountUtxo) =>
        // @ts-expect-error - coinjoin reason not yet implemented (#7323)
        excludedUtxos[getUtxoOutpoint(utxo)] !== 'coinjoin';

    // has coin control been enabled manually?
    const isCoinControlEnabled = watch('isCoinControlEnabled');
    // fee level
    const selectedFee = watch('selectedFee');
    // confirmation of spending low-anonymity UTXOs - only relevant for coinjoin account
    const anonymityWarningChecked = watch('anonymityWarningChecked');
    // manually selected UTXOs, stripped from UTXOs which cannot be selected due to being registered for coinjoin
    const selectedUtxos: AccountUtxo[] = watch('selectedUtxos')?.filter(canBeSelected) || [];

    const spendableUtxos: AccountUtxo[] = [];
    const lowAnonymityUtxos: AccountUtxo[] = [];
    const dustUtxos: AccountUtxo[] = [];
    account?.utxo?.forEach(utxo => {
        switch (excludedUtxos[getUtxoOutpoint(utxo)]) {
            case 'low-anonymity':
                lowAnonymityUtxos.push(utxo);
                return;
            case 'dust':
                dustUtxos.push(utxo);
                return;
            default:
                spendableUtxos.push(utxo);
        }
    });

    // category displayed on top and controlled by the check-all checkbox, without UTXOs registered for coinjoin
    const topCategory =
        [spendableUtxos, lowAnonymityUtxos, dustUtxos].find(utxoCategory => utxoCategory.length) ||
        [];

    // are all UTXOs in the top category selected?
    const allUtxosSelected = !!topCategory
        ?.filter(canBeSelected)
        .every(utxo =>
            selectedUtxos.some(
                selected => selected.txid === utxo.txid && selected.vout === utxo.vout,
            ),
        );

    // transaction composed for the fee level chosen by the user
    const composedLevel = composedLevels?.[selectedFee || 'normal'];

    // inputs to be used in the transactions
    const composedInputs = useMemo(
        () =>
            composedLevel && 'transaction' in composedLevel ? composedLevel.transaction.inputs : [],
        [composedLevel],
    ) as PROTO.TxInputType[];

    // UTXOs corresponding to the inputs
    // it is a different object type, but some properties are shared between the two
    const preselectedUtxos = useMemo(
        () =>
            account.utxo?.filter(utxo =>
                composedInputs.some(
                    input => input.prev_hash === utxo.txid && input.prev_index === utxo.vout,
                ),
            ) || [],
        [account.utxo, composedInputs],
    );

    // at least one of the selected UTXOs does not comply to target anonymity
    const isLowAnonymityUtxoSelected =
        account.accountType === 'coinjoin' &&
        selectedUtxos.some(
            selectedUtxo => excludedUtxos[getUtxoOutpoint(selectedUtxo)] === 'low-anonymity',
        );

    // uncheck the confirmation checkbox whenever it is hidden
    if (!isLowAnonymityUtxoSelected && anonymityWarningChecked) {
        setValue('anonymityWarningChecked', false);
    }

    const toggleAnonymityWarning = () =>
        setValue('anonymityWarningChecked', !anonymityWarningChecked);

    // uncheck all UTXOs or check all spendable UTXOs and enable coin control
    const toggleCheckAllUtxos = () => {
        if (allUtxosSelected) {
            setValue('selectedUtxos', []);
        } else {
            // check top category and keep any already checked UTXOs from other categories
            const selectedUtxosFromLowerCategories = selectedUtxos.filter(
                utxo => !topCategory?.find(u => u.txid === utxo.txid && u.vout === utxo.vout),
            );
            setValue('selectedUtxos', topCategory.concat(selectedUtxosFromLowerCategories));
            setValue('isCoinControlEnabled', true);
        }
        composeRequest();
    };

    // enable coin control or disable it and reset selected UTXOs
    const toggleCoinControl = () => {
        setValue('isCoinControlEnabled', !isCoinControlEnabled);
        setValue('selectedUtxos', isCoinControlEnabled ? [] : preselectedUtxos);
        composeRequest();
    };

    // uncheck a UTXO or check it and enable coin control
    const toggleUtxoSelection = (utxo: AccountUtxo) => {
        const isSameUtxo = (u: AccountUtxo) => u.txid === utxo.txid && u.vout === utxo.vout;

        const alreadySelectedUtxo = selectedUtxos.find(isSameUtxo);
        if (alreadySelectedUtxo) {
            // uncheck the UTXO if already selected
            setValue(
                'selectedUtxos',
                selectedUtxos.filter(u => u !== alreadySelectedUtxo),
            );
        } else {
            // check the UTXO
            // however, in case the coin control has not been enabled and the UTXO has been preselected, do not check it
            const selectedUtxosOld = !isCoinControlEnabled ? preselectedUtxos : selectedUtxos;
            const selectedUtxosNew = preselectedUtxos.some(isSameUtxo)
                ? preselectedUtxos
                : [...selectedUtxosOld, utxo];

            setValue('selectedUtxos', selectedUtxosNew);
            setValue('isCoinControlEnabled', true);
        }
        composeRequest();
    };

    return {
        allUtxosSelected,
        anonymityWarningChecked,
        composedInputs,
        dustUtxos,
        isCoinControlEnabled,
        isLowAnonymityUtxoSelected,
        lowAnonymityUtxos,
        selectedUtxos,
        spendableUtxos,
        toggleAnonymityWarning,
        toggleCheckAllUtxos,
        toggleCoinControl,
        toggleUtxoSelection,
    };
};
