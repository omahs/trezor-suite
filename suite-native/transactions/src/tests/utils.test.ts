import { VinVoutAddress } from '../types';
import { mapTransactionInputsOutputsToAddresses, sortTargetAddressesToBeginning } from '../utils';
import {
    transactionWithTargetInOutputs,
    transactionWithChangeAddress,
} from './fixtures/transactions';

describe('mapTransactionInputsOutputsToAddresses', () => {
    test('should return an empty array when input is empty', () => {
        expect(mapTransactionInputsOutputsToAddresses([], 'inputs', true)).toEqual([]);
    });

    test('should return correct concatenated non-null addresses for transaction inputs', () => {
        const expectedOutput: VinVoutAddress[] = [
            { address: 'bc1q39kuc35n722fmy0nw3qqhpvg0ch8f0a6rt22xs', isChangeAddress: false },
            { address: 'bc346cd7c787e903ac4b41e4fd2e038a81cb696d5dbf87', isChangeAddress: false },
        ];
        expect(
            mapTransactionInputsOutputsToAddresses(
                transactionWithTargetInOutputs.details.vin,
                'inputs',
                false,
            ),
        ).toEqual(expectedOutput);
    });

    test('should return correct concatenated non-null addresses for Target input', () => {
        const expectedOutput: VinVoutAddress[] = [
            { address: '3BcXPstZ4ZHhvLxPFkjFocuFySKt8nsGgs', isChangeAddress: false },
            { address: '3QpCQP3A2q7kCr8QgsWuqG1Bg1P6RySonw', isChangeAddress: false },
        ];
        expect(
            mapTransactionInputsOutputsToAddresses(
                transactionWithTargetInOutputs.details.vout,
                'outputs',
                false,
            ),
        ).toEqual(expectedOutput);
    });
});

describe('sortTargetAddressesToBeginning', () => {
    test('should return an empty array when both inputs and targets are empty', () => {
        expect(sortTargetAddressesToBeginning([], [])).toEqual([]);
    });

    test('should return empty array if only targets are present', () => {
        const targetAddresses = mapTransactionInputsOutputsToAddresses(
            transactionWithTargetInOutputs.targets,
            'outputs',
            false,
        );

        expect(sortTargetAddressesToBeginning([], targetAddresses)).toEqual([]);
    });

    test('should return unchanged transaction inputs if targets not present', () => {
        const inputAddresses = mapTransactionInputsOutputsToAddresses(
            transactionWithTargetInOutputs.details.vin,
            'inputs',
            true,
        );

        expect(sortTargetAddressesToBeginning(inputAddresses, [])).toEqual(inputAddresses);
    });

    test('should return unchanged transaction inputs if targets are not included', () => {
        const inputAddresses = mapTransactionInputsOutputsToAddresses(
            transactionWithTargetInOutputs.details.vin,
            'inputs',
            false,
        );
        const targetAddresses = mapTransactionInputsOutputsToAddresses(
            transactionWithTargetInOutputs.targets,
            'outputs',
            false,
        );

        expect(sortTargetAddressesToBeginning(inputAddresses, targetAddresses)).toEqual(
            inputAddresses,
        );
    });

    test('should targets at the beginning of the array', () => {
        const outputAddresses = mapTransactionInputsOutputsToAddresses(
            transactionWithTargetInOutputs.details.vout,
            'outputs',
            false,
        );
        const targetAddresses = mapTransactionInputsOutputsToAddresses(
            transactionWithTargetInOutputs.targets,
            'outputs',
            false,
        );

        const expectedResult: VinVoutAddress[] = [
            { address: '3QpCQP3A2q7kCr8QgsWuqG1Bg1P6RySonw', isChangeAddress: false },
            { address: '3BcXPstZ4ZHhvLxPFkjFocuFySKt8nsGgs', isChangeAddress: false },
        ];

        expect(sortTargetAddressesToBeginning(outputAddresses, targetAddresses)).toEqual(
            expectedResult,
        );
    });

    test('identify change address of a sent transaction', () => {
        const outputAddresses = mapTransactionInputsOutputsToAddresses(
            transactionWithChangeAddress.details.vout,
            'outputs',
            true,
        );
        const targetAddresses = mapTransactionInputsOutputsToAddresses(
            transactionWithChangeAddress.targets,
            'outputs',
            true,
        );

        const expectedResult: VinVoutAddress[] = [
            { address: 'bc1ql2ntmq4jlq5g2q53q89c7f7d27s35se96jq6kw', isChangeAddress: false },
            { address: 'bc1qt5mjvp7nt4lpq77s4c3trvyre2smtcxz4zmmjs', isChangeAddress: true },
        ];

        expect(sortTargetAddressesToBeginning(outputAddresses, targetAddresses)).toEqual(
            expectedResult,
        );
    });
});
