import { useMemo } from 'react';
import { useSelector } from 'src/hooks/suite';
import { buildOption, getDefaultCountry } from 'src/utils/wallet/coinmarket/coinmarketUtils';
import { P2pInfo } from 'src/actions/wallet/coinmarketP2pActions';

export const useCoinmarketP2pFormDefaultValues = (p2pInfo?: P2pInfo) => {
    const { localCurrency } = useSelector(state => ({
        localCurrency: state.wallet.settings.localCurrency,
    }));

    const country = p2pInfo?.country;
    const suggestedFiatCurrency = p2pInfo?.suggestedFiatCurrency || localCurrency;

    const defaultCountry = useMemo(() => getDefaultCountry(country), [country]);
    const defaultCurrency = useMemo(
        () => buildOption(suggestedFiatCurrency),
        [suggestedFiatCurrency],
    );
    const defaultValues = useMemo(
        () =>
            p2pInfo
                ? {
                      fiatInput: '',
                      currencySelect: defaultCurrency,
                      countrySelect: defaultCountry,
                  }
                : undefined,
        [p2pInfo, defaultCountry, defaultCurrency],
    );

    return { defaultValues, defaultCountry, defaultCurrency };
};
