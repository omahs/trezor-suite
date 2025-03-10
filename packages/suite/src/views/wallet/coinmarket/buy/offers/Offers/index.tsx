import React from 'react';
import styled from 'styled-components';
import { CoinmarketFooter, CoinmarketBuyTopPanel } from 'src/components/wallet';
import { variables } from '@trezor/components';
import { Translation } from 'src/components/suite';
import { useLayout } from 'src/hooks/suite';
import { useCoinmarketBuyOffersContext } from 'src/hooks/wallet/useCoinmarketBuyOffers';
import { useCoinmarketNavigation } from 'src/hooks/wallet/useCoinmarketNavigation';
import NoOffers from 'src/views/wallet/coinmarket/common/no-offers';
import List from './List';
import SelectedOffer from './SelectedOffer';

const Wrapper = styled.div`
    padding: 16px 32px 32px 32px;

    @media screen and (max-width: ${variables.SCREEN_SIZE.LG}) {
        padding: 16px;
    }

    @media (max-width: ${variables.SCREEN_SIZE.SM}) {
        padding: 0;
    }
`;

const Divider = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    cursor: default;
    padding: 61px 0;
`;

const DividerLine = styled.div`
    height: 1px;
    flex: 1;
    background: ${props => props.theme.STROKE_GREY};
`;

const DividerLeft = styled(DividerLine)``;
const DividerRight = styled(DividerLine)``;

const Currency = styled.div`
    color: ${props => props.theme.TYPE_DARK_GREY};
    text-transform: uppercase;
    padding-left: 3px;
`;

const DividerMiddle = styled.div`
    display: flex;
    align-items: center;
    padding: 5px 20px;
    color: ${props => props.theme.TYPE_LIGHT_GREY};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    font-size: ${variables.FONT_SIZE.SMALL};
    border-radius: 25px;
    border: 1px solid ${props => props.theme.STROKE_GREY};
    background: ${props => props.theme.BG_WHITE};
    text-align: center;
`;

const Offers = () => {
    const { account, quotes, alternativeQuotes, selectedQuote, timer, getQuotes } =
        useCoinmarketBuyOffersContext();
    const { navigateToBuyForm } = useCoinmarketNavigation(account);

    useLayout('Trezor Suite | Trade', CoinmarketBuyTopPanel);

    const hasLoadingFailed = !(quotes && alternativeQuotes);
    const noOffers = hasLoadingFailed || (quotes.length === 0 && alternativeQuotes.length === 0);
    return (
        <Wrapper>
            {!selectedQuote && (
                <>
                    {noOffers ? (
                        <NoOffers
                            coinmarketRefreshTimeIsLoading={timer.isLoading}
                            coinmarketRefreshTimeSeconds={timer.timeSpend.seconds}
                            onBackButtonClick={navigateToBuyForm}
                            onReloadOffersButtonClick={getQuotes}
                            hasLoadingFailed={hasLoadingFailed}
                        />
                    ) : (
                        <>
                            <List quotes={quotes} />
                            {alternativeQuotes.length > 0 && (
                                <>
                                    <Divider>
                                        <DividerLeft />
                                        <DividerMiddle>
                                            <Translation id="TR_BUY_OTHER_OFFERS_IN" />
                                            <Currency>{alternativeQuotes[0].fiatCurrency}</Currency>
                                        </DividerMiddle>
                                        <DividerRight />
                                    </Divider>
                                    <List isAlternative quotes={alternativeQuotes} />
                                </>
                            )}
                        </>
                    )}
                </>
            )}
            {selectedQuote && <SelectedOffer />}
            <CoinmarketFooter />
        </Wrapper>
    );
};

export default Offers;
