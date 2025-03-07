import React from 'react';
import BigNumber from 'bignumber.js';
import { Input, Icon } from '@trezor/components';
import { QuestionTooltip } from 'src/components/suite';
import { useSendFormContext } from 'src/hooks/wallet';
import { getInputState, isInteger } from '@suite-common/wallet-utils';
import { U_INT_32 } from '@suite-common/wallet-constants';
import { MAX_LENGTH } from 'src/constants/suite/inputs';
import { useTranslation } from 'src/hooks/suite';

interface DestinationTagProps {
    close: () => void;
}

const DestinationTag = ({ close }: DestinationTagProps) => {
    const {
        register,
        getDefaultValue,
        formState: { errors },
        composeTransaction,
    } = useSendFormContext();

    const { translationString } = useTranslation();

    const inputName = 'rippleDestinationTag';
    const inputValue = getDefaultValue(inputName) || '';
    const error = errors[inputName];
    const { ref: inputRef, ...inputField } = register(inputName, {
        onChange: () => composeTransaction(inputName),
        required: translationString('DESTINATION_TAG_NOT_SET'),
        validate: (value = '') => {
            const amountBig = new BigNumber(value);
            if (amountBig.isNaN()) {
                return translationString('DESTINATION_TAG_IS_NOT_NUMBER');
            }
            if (!isInteger(value) || amountBig.lt(0) || amountBig.gt(U_INT_32)) {
                return translationString('DESTINATION_TAG_IS_NOT_VALID');
            }
        },
    });

    return (
        <Input
            inputState={getInputState(error, inputValue)}
            isMonospace
            data-test={inputName}
            defaultValue={inputValue}
            maxLength={MAX_LENGTH.XRP_DESTINATION_TAG}
            label={<QuestionTooltip label="DESTINATION_TAG" tooltip="DESTINATION_TAG_EXPLAINED" />}
            labelRight={<Icon size={20} icon="CROSS" useCursorPointer onClick={close} />}
            bottomText={error?.message}
            innerRef={inputRef}
            {...inputField}
        />
    );
};

export default DestinationTag;
