import { DEVICE } from '@trezor/connect';
import { configureStore } from 'src/support/tests/configureStore';
import { Middleware } from 'redux';

import * as routerActions from 'src/actions/suite/routerActions';
import { SUITE } from 'src/actions/suite/constants';

import routerReducer from 'src/reducers/suite/routerReducer';
import deviceReducer from 'src/reducers/suite/deviceReducer';
import suiteReducer from 'src/reducers/suite/suiteReducer';
import modalReducer from 'src/reducers/suite/modalReducer';

import suiteMiddleware from 'src/middlewares/suite/suiteMiddleware';
import redirectMiddleware from 'src/middlewares/suite/redirectMiddleware';
import { Action } from 'src/types/suite';

const { getSuiteDevice } = global.JestMocks;

jest.mock('src/actions/suite/storageActions', () => ({ __esModule: true }));

type SuiteState = ReturnType<typeof suiteReducer>;
type DevicesState = ReturnType<typeof deviceReducer>;
type RouterState = ReturnType<typeof routerReducer>;
type ModalState = ReturnType<typeof modalReducer>;

const getInitialState = (
    suite?: Partial<SuiteState>,
    devices?: DevicesState,
    router?: Partial<RouterState>,
    modal?: Partial<ModalState>,
) => ({
    suite: {
        ...suiteReducer(undefined, { type: 'foo' } as any),
        ...suite,
    },
    devices: devices || [],
    router: {
        ...routerReducer(undefined, { type: 'foo' } as any),
        ...router,
    },
    modal: {
        ...modalReducer(undefined, { type: 'foo' } as any),
        ...modal,
    },
    messageSystem: {},
});

type State = ReturnType<typeof getInitialState>;
const middlewares: Middleware<any, any>[] = [redirectMiddleware, suiteMiddleware];

const initStore = (state: State) => {
    const mockStore = configureStore<State, Action>(middlewares);
    const store = mockStore(state);
    store.subscribe(() => {
        const action = store.getActions().pop();
        const { suite, router, devices } = store.getState();
        store.getState().suite = suiteReducer(suite, action);
        store.getState().router = routerReducer(router as RouterState, action);
        store.getState().devices = deviceReducer(devices, action);

        // add action back to stack
        store.getActions().push(action);
    });
    return store;
};

describe('redirectMiddleware', () => {
    describe('redirects on DEVICE.CONNECT event', () => {
        let goto: any;
        beforeEach(() => {
            goto = jest.spyOn(routerActions, 'goto');
        });
        afterEach(() => {
            goto.mockClear();
        });
        it('DEVICE.CONNECT mode=initialize', () => {
            const store = initStore(getInitialState());
            store.dispatch({
                type: DEVICE.CONNECT,
                payload: getSuiteDevice({ mode: 'initialize' }),
            });
            expect(goto).toHaveBeenNthCalledWith(1, 'onboarding-index');
        });

        it('DEVICE.CONNECT firmware=required', () => {
            const store = initStore(getInitialState());
            store.dispatch({
                type: DEVICE.CONNECT,
                payload: getSuiteDevice({ mode: 'normal', firmware: 'required' }),
            });
            expect(goto).toHaveBeenNthCalledWith(1, 'firmware-index');
        });

        it('SUITE.SELECT_DEVICE reset wallet params', () => {
            const store = initStore(
                getInitialState(
                    {
                        device: getSuiteDevice(
                            {
                                path: '2',
                            },
                            {
                                device_id: 'previous-device',
                            },
                        ),
                    },
                    undefined,
                    {
                        app: 'wallet',
                        params: {
                            symbol: 'btc',
                            accountIndex: 2,
                            accountType: 'normal',
                        },
                        route: {
                            name: 'wallet-index',
                            pattern: '/accounts',
                            app: 'wallet',
                            params: ['symbol', 'accountIndex', 'accountType'],
                            isForegroundApp: undefined,
                            isFullscreenApp: undefined,
                            exact: true,
                        },
                    },
                ),
            );
            store.dispatch({
                type: SUITE.SELECT_DEVICE,
                payload: getSuiteDevice(),
            });
            expect(goto).toHaveBeenNthCalledWith(1, 'wallet-index');
        });
    });
});
