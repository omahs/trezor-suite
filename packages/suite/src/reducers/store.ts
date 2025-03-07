// fixes bindActionCreators() https://github.com/reduxjs/redux-thunk/blob/e3d452948d5562b9ce871cc9391403219f83b4ff/extend-redux.d.ts#L11
/// <reference types="redux-thunk/extend-redux" />
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import suiteMiddlewares from 'src/middlewares/suite';
import walletMiddlewares from 'src/middlewares/wallet';
import onboardingMiddlewares from 'src/middlewares/onboarding';
import firmwareMiddlewares from 'src/middlewares/firmware';
import backupMiddlewares from 'src/middlewares/backup';
import recoveryMiddlewares from 'src/middlewares/recovery';
import suiteReducers from 'src/reducers/suite';
import walletReducers from 'src/reducers/wallet';
import onboardingReducers from 'src/reducers/onboarding';
import recoveryReducers from 'src/reducers/recovery';
import firmwareReducers from 'src/reducers/firmware';
import backupReducers from 'src/reducers/backup';

// toastMiddleware can be used only in suite-desktop and suite-web
// it's not included into `@suite-middlewares` index
import toastMiddleware from 'src/middlewares/suite/toastMiddleware';
import type { PreloadStoreAction } from 'src/support/suite/preloadStore';

import { addLog } from '@suite-common/logger';

import { desktopReducer } from './desktop';
import { extraDependencies } from '../support/extraDependencies';

const rootReducer = combineReducers({
    ...suiteReducers,
    onboarding: onboardingReducers,
    wallet: walletReducers,
    recovery: recoveryReducers,
    firmware: firmwareReducers,
    backup: backupReducers,
    desktop: desktopReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

const middleware = [
    thunkMiddleware.withExtraArgument(extraDependencies),
    toastMiddleware,
    ...suiteMiddlewares,
    ...walletMiddlewares,
    ...onboardingMiddlewares,
    ...firmwareMiddlewares,
    ...backupMiddlewares,
    ...recoveryMiddlewares,
];

const excludedActions = [addLog.type];

if (!process.env.CODESIGN_BUILD) {
    const excludeLogger = (_getState: any, action: any): boolean => {
        const pass = excludedActions.filter(act => action.type === act);
        return pass.length === 0;
    };

    const logger = createLogger({
        level: 'info',
        predicate: excludeLogger,
        collapsed: true,
    });
    middleware.push(logger);
}

const devTools =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? {
              actionsBlacklist: excludedActions,
          }
        : false;

export const initStore = (preloadStoreAction?: PreloadStoreAction) => {
    // get initial state by calling STORAGE.LOAD action with optional payload
    // payload will be processed in each reducer explicitly
    const preloadedState = preloadStoreAction
        ? rootReducer(undefined, preloadStoreAction)
        : undefined;

    return configureStore({
        reducer: rootReducer,
        preloadedState,
        middleware,
        devTools,
    });
};
