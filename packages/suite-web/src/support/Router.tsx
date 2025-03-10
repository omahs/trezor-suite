import React, { lazy, memo, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import routes from 'src/constants/suite/routes';
import { BundleLoader } from 'src/components/suite';

const components: { [key: string]: React.LazyExoticComponent<any> } = {
    'suite-index': lazy(() => import(/* webpackChunkName: "dashboard" */ 'src/views/dashboard')),
    'notifications-index': lazy(
        () => import(/* webpackChunkName: "notifications" */ 'src/views/suite/notifications'),
    ),

    // wallet
    'wallet-index': lazy(() =>
        import(/* webpackChunkName: "wallet" */ 'src/views/wallet/transactions/Transactions').then(
            ({ Transactions }) => ({ default: Transactions }),
        ),
    ),
    'wallet-receive': lazy(
        () => import(/* webpackChunkName: "wallet" */ 'src/views/wallet/receive'),
    ),
    'wallet-details': lazy(
        () => import(/* webpackChunkName: "wallet" */ 'src/views/wallet/details'),
    ),
    'wallet-tokens': lazy(() => import(/* webpackChunkName: "wallet" */ 'src/views/wallet/tokens')),
    'wallet-send': lazy(() => import(/* webpackChunkName: "wallet" */ 'src/views/wallet/send')),
    'wallet-staking': lazy(() =>
        import(/* webpackChunkName: "wallet" */ 'src/views/wallet/staking/WalletStaking').then(
            ({ WalletStaking }) => ({ default: WalletStaking }),
        ),
    ),
    'wallet-sign-verify': lazy(
        () => import(/* webpackChunkName: "wallet" */ 'src/views/wallet/sign-verify'),
    ),
    'wallet-anonymize': lazy(
        () => import(/* webpackChunkName: "wallet" */ 'src/views/wallet/anonymize'),
    ),

    // coinmarket
    'wallet-coinmarket-buy': lazy(
        () => import(/* webpackChunkName: "coinmarket" */ 'src/views/wallet/coinmarket/buy'),
    ),
    'wallet-coinmarket-buy-detail': lazy(
        () => import(/* webpackChunkName: "coinmarket" */ 'src/views/wallet/coinmarket/buy/detail'),
    ),
    'wallet-coinmarket-buy-offers': lazy(
        () => import(/* webpackChunkName: "coinmarket" */ 'src/views/wallet/coinmarket/buy/offers'),
    ),
    'wallet-coinmarket-sell': lazy(
        () => import(/* webpackChunkName: "coinmarket" */ 'src/views/wallet/coinmarket/sell'),
    ),
    'wallet-coinmarket-sell-detail': lazy(
        () =>
            import(/* webpackChunkName: "coinmarket" */ 'src/views/wallet/coinmarket/sell/detail'),
    ),
    'wallet-coinmarket-sell-offers': lazy(
        () =>
            import(/* webpackChunkName: "coinmarket" */ 'src/views/wallet/coinmarket/sell/offers'),
    ),
    'wallet-coinmarket-exchange': lazy(
        () => import(/* webpackChunkName: "coinmarket" */ 'src/views/wallet/coinmarket/exchange'),
    ),
    'wallet-coinmarket-exchange-detail': lazy(
        () =>
            import(
                /* webpackChunkName: "coinmarket" */ 'src/views/wallet/coinmarket/exchange/detail'
            ),
    ),
    'wallet-coinmarket-exchange-offers': lazy(
        () =>
            import(
                /* webpackChunkName: "coinmarket" */ 'src/views/wallet/coinmarket/exchange/offers'
            ),
    ),
    'wallet-coinmarket-spend': lazy(
        () => import(/* webpackChunkName: "coinmarket" */ 'src/views/wallet/coinmarket/spend'),
    ),
    'wallet-coinmarket-p2p': lazy(
        () => import(/* webpackChunkName: "coinmarket" */ 'src/views/wallet/coinmarket/p2p/form'),
    ),
    'wallet-coinmarket-p2p-offers': lazy(
        () => import(/* webpackChunkName: "coinmarket" */ 'src/views/wallet/coinmarket/p2p/offers'),
    ),
    'wallet-coinmarket-savings-setup': lazy(
        () =>
            import(
                /* webpackChunkName: "coinmarket" */ 'src/views/wallet/coinmarket/savings/setup'
            ),
    ),
    'wallet-coinmarket-savings-setup-continue': lazy(
        () =>
            import(
                /* webpackChunkName: "coinmarket" */ 'src/views/wallet/coinmarket/savings/setup/continue'
            ),
    ),
    'wallet-coinmarket-savings-setup-waiting': lazy(
        () =>
            import(
                /* webpackChunkName: "coinmarket" */ 'src/views/wallet/coinmarket/savings/setup/waiting'
            ),
    ),
    'wallet-coinmarket-savings-payment-info': lazy(
        () =>
            import(
                /* webpackChunkName: "coinmarket" */ 'src/views/wallet/coinmarket/savings/payment-info'
            ),
    ),
    'wallet-coinmarket-savings-overview': lazy(
        () =>
            import(
                /* webpackChunkName: "coinmarket" */ 'src/views/wallet/coinmarket/savings/overview'
            ),
    ),
    'wallet-coinmarket-redirect': lazy(
        () => import(/* webpackChunkName: "coinmarket" */ 'src/views/wallet/coinmarket/redirect'),
    ),

    // settings
    'settings-index': lazy(() =>
        import(
            /* webpackChunkName: "settings" */ 'src/views/settings/general/SettingsGeneral'
        ).then(({ SettingsGeneral }) => ({ default: SettingsGeneral })),
    ),
    'settings-coins': lazy(() =>
        import(/* webpackChunkName: "settings" */ 'src/views/settings/coins/SettingsCoins').then(
            ({ SettingsCoins }) => ({ default: SettingsCoins }),
        ),
    ),
    'settings-debug': lazy(() =>
        import(/* webpackChunkName: "settings" */ 'src/views/settings/debug/SettingsDebug').then(
            ({ SettingsDebug }) => ({ default: SettingsDebug }),
        ),
    ),
    'settings-device': lazy(() =>
        import(/* webpackChunkName: "settings" */ 'src/views/settings/device/SettingsDevice').then(
            ({ SettingsDevice }) => ({ default: SettingsDevice }),
        ),
    ),
};

const AppRouter = () => (
    // inititating strict mode higher would throw an error from react-helmet
    // TODO: replace react-helmet with a maintained alternative
    // strict mode is commented out because of its interplay with compose errors in send form
    // <React.StrictMode>
    <Suspense fallback={<BundleLoader />}>
        <Switch>
            {routes.map(route => (
                <Route
                    key={route.name}
                    path={process.env.ASSET_PREFIX + route.pattern}
                    exact={route.exact}
                    component={components[route.name]}
                />
            ))}
        </Switch>
    </Suspense>
    // </React.StrictMode>
);

export default memo(AppRouter);
