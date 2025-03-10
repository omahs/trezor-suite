import React from 'react';
import { Fees } from 'src/components/wallet/Fees';
import { useRbfContext } from 'src/hooks/wallet/useRbfForm';

// wrapper for shareable Fees component
const RbfFees = () => {
    const {
        formState: { errors },
        register,
        control,
        setValue,
        getValues,
        changeFeeLevel,
        account,
        feeInfo,
        composedLevels,
    } = useRbfContext();

    return (
        <Fees
            control={control}
            errors={errors}
            register={register}
            feeInfo={feeInfo}
            setValue={setValue}
            getValues={getValues}
            account={account}
            composedLevels={composedLevels}
            changeFeeLevel={changeFeeLevel}
            label="TR_NEW_FEE"
            rbfForm
        />
    );
};

export default RbfFees;
