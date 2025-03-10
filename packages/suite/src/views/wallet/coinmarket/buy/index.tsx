import React from 'react';
import { useCoinmarketBuyForm, BuyFormContext } from 'src/hooks/wallet/useCoinmarketBuyForm';
import {
    CoinmarketLayout,
    WithSelectedAccountLoadedProps,
    withSelectedAccountLoaded,
} from 'src/components/wallet';
import BuyForm from './components/BuyForm';

const CoinmarketBuy = (props: WithSelectedAccountLoadedProps) => {
    const coinmarketBuyContextValues = useCoinmarketBuyForm(props);
    const {
        isDraft,
        formState: { isDirty },
        handleClearFormButtonClick,
    } = coinmarketBuyContextValues;
    return (
        <CoinmarketLayout
            selectedAccount={props.selectedAccount}
            onClearFormButtonClick={isDirty || isDraft ? handleClearFormButtonClick : undefined}
        >
            <BuyFormContext.Provider value={coinmarketBuyContextValues}>
                <BuyForm />
            </BuyFormContext.Provider>
        </CoinmarketLayout>
    );
};

export default withSelectedAccountLoaded(CoinmarketBuy, {
    title: 'TR_NAV_BUY',
});
