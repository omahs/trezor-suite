import React from 'react';
import styled from 'styled-components';
import { useSendFormContext } from 'src/hooks/wallet';
import { Translation } from 'src/components/suite';
import { Textarea, Icon, Tooltip } from '@trezor/components';
import { getInputState, isHexValid } from '@suite-common/wallet-utils';
import { OpenGuideFromTooltip } from 'src/components/guide';
import { MAX_LENGTH } from 'src/constants/suite/inputs';
import { useTranslation } from 'src/hooks/suite';

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-items: space-between;
    align-items: center;
`;

const Label = styled.div`
    display: flex;
    align-items: center;
`;

const Space = styled.div`
    display: flex;
    justify-content: center;
    min-width: 65px;
`;

const OpReturn = ({ outputId }: { outputId: number }) => {
    const {
        register,
        outputs,
        getDefaultValue,
        setValue,
        formState: { errors },
        composeTransaction,
        removeOpReturn,
    } = useSendFormContext();

    const { translationString } = useTranslation();

    const inputAsciiName = `outputs.${outputId}.dataAscii` as const;
    const inputHexName = `outputs.${outputId}.dataHex` as const;

    const asciiValue = getDefaultValue(inputAsciiName, outputs[outputId].dataAscii || '');
    const hexValue = getDefaultValue(inputHexName, outputs[outputId].dataHex || '');

    const outputError = errors.outputs ? errors.outputs[outputId] : undefined;
    const asciiError = outputError ? outputError.dataAscii : undefined;
    const hexError = outputError ? outputError.dataHex : undefined;

    const { ref: asciiRef, ...asciiField } = register(inputAsciiName, {
        onChange: event => {
            setValue(inputHexName, Buffer.from(event.target.value, 'ascii').toString('hex'), {
                shouldValidate: true,
            });
            composeTransaction(inputAsciiName);
        },
        required: translationString('DATA_NOT_SET'),
    });
    const { ref: hexRef, ...hexField } = register(inputHexName, {
        onChange: event => {
            setValue(
                inputAsciiName,
                !hexError ? Buffer.from(event.target.value, 'hex').toString('ascii') : '',
            );
            composeTransaction(inputHexName);
        },
        required: translationString('DATA_NOT_SET'),
        validate: (value = '') => {
            if (!isHexValid(value)) return translationString('DATA_NOT_VALID_HEX');
            if (value.length > 80 * 2) return translationString('DATA_HEX_TOO_BIG');
        },
    });

    return (
        <Wrapper>
            <Textarea
                inputState={getInputState(asciiError, asciiValue)}
                isMonospace
                data-test={inputAsciiName}
                defaultValue={asciiValue}
                maxLength={MAX_LENGTH.OP_RETURN}
                bottomText={asciiError?.message}
                label={
                    <Label>
                        <Tooltip
                            guideAnchor={instance => (
                                <OpenGuideFromTooltip
                                    id="/3_send-and-receive/transactions-in-depth/op_return.md"
                                    instance={instance}
                                />
                            )}
                            content={<Translation id="OP_RETURN_TOOLTIP" />}
                            dashed
                        >
                            <Translation id="OP_RETURN" />
                        </Tooltip>
                    </Label>
                }
                innerRef={asciiRef}
                {...asciiField}
            />
            <Space> = </Space>
            <Textarea
                inputState={getInputState(hexError, hexValue)}
                isMonospace
                data-test={inputHexName}
                defaultValue={hexValue}
                maxLength={MAX_LENGTH.OP_RETURN}
                bottomText={hexError?.message}
                labelRight={
                    <Icon size={20} icon="CROSS" onClick={() => removeOpReturn(outputId)} />
                }
                innerRef={hexRef}
                {...hexField}
            />
        </Wrapper>
    );
};

export default OpReturn;
