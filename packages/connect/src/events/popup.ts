import { UI_EVENT } from './ui-request';
import type { TransportInfo } from './transport';
import type { ConnectSettings, SystemInfo } from '../types';
import type { MessageFactoryFn } from '../types/utils';
import { CoreMessage } from './core';

export const POPUP = {
    // Message called from popup.html inline script before "window.onload" event. This is first message from popup to window.opener.
    BOOTSTRAP: 'popup-bootstrap',
    // Message from popup.js to window.opener, called after "window.onload" event. This is second message from popup to window.opener.
    LOADED: 'popup-loaded',
    // Message from window.opener to popup.js. Send settings to popup. This is first message from window.opener to popup.
    INIT: 'popup-init',
    // Error message from popup to window.opener. Could be thrown during popup initialization process (POPUP.INIT)
    ERROR: 'popup-error',
    // Error message from PopupManager to popup so it displays error page.
    SHOW_ERROR: 'show-error',
    // Message to webextensions, opens "trezor-usb-permission.html" within webextension
    EXTENSION_USB_PERMISSIONS: 'open-usb-permissions',
    // Message called from both [popup > iframe] then [iframe > popup] in this exact order.
    // Firstly popup call iframe to resolve popup promise in Core
    // Then iframe reacts to POPUP.HANDSHAKE message and sends ConnectSettings, transport information and requested method details back to popup
    HANDSHAKE: 'popup-handshake',
    // Event emitted from PopupManager at the end of popup closing process.
    // Sent from popup thru window.opener to an iframe because message channel between popup and iframe is no longer available
    CLOSED: 'popup-closed',
    // We keep sending this message to avoid breaking changes in 3rd party, it is emitted when popup will not be needed.
    // every time that `SUCCESS_CANCEL_POPUP_REQUEST` or `ERROR_CANCEL_POPUP_REQUEST` is emitted.
    CANCEL_POPUP_REQUEST: 'ui-cancel-popup-request',
    // Message emitted from iframe to PopupManager, it means that popup will not be needed since request successfully finished.
    SUCCESS_CANCEL_POPUP_REQUEST: 'ui-success-cancel-popup-request',
    // Message emitted from iframe to PopupManager, it means that popup should display error message.
    ERROR_CANCEL_POPUP_REQUEST: 'ui-error-cancel-popup-request',
    // Message called from inline element in popup.html (window.closeWindow), this is used only with webextensions to properly handle popup close event
    CLOSE_WINDOW: 'window.close',
} as const;

export interface PopupInit {
    type: typeof POPUP.INIT;
    payload: {
        settings: ConnectSettings; // settings from window.opener (sent by @trezor/connect-web)
        useBroadcastChannel: boolean;
        systemInfo: SystemInfo;
    };
}

export interface PopupHandshake {
    type: typeof POPUP.HANDSHAKE;
    payload: {
        settings: ConnectSettings; // those are settings from the iframe, they could be different from window.opener settings
        method?: string;
        transport?: TransportInfo;
    };
}

export interface PopupError {
    type: typeof POPUP.ERROR;
    payload: {
        error: string;
    };
}

export interface PopupShowError {
    type: typeof POPUP.SHOW_ERROR;
    payload: {
        error: string;
    };
}

export interface PopupClosedMessage {
    type: typeof POPUP.CLOSED;
    payload: { error: any } | null;
}

export type PopupEvent =
    | {
          type:
              | typeof POPUP.LOADED
              | typeof POPUP.CANCEL_POPUP_REQUEST
              | typeof POPUP.ERROR_CANCEL_POPUP_REQUEST
              | typeof POPUP.SUCCESS_CANCEL_POPUP_REQUEST;
          payload?: typeof undefined;
      }
    | PopupInit
    | PopupHandshake
    | PopupError
    | PopupShowError
    | PopupClosedMessage;

export type PopupEventMessage = PopupEvent & { event: typeof UI_EVENT };

export const createPopupMessage: MessageFactoryFn<typeof UI_EVENT, PopupEvent> = (type, payload) =>
    ({
        event: UI_EVENT,
        type,
        payload,
    } as any);

export const postErrorCancelPopupRequest = (postMessage: (message: CoreMessage) => void) => {
    postMessage(createPopupMessage(POPUP.ERROR_CANCEL_POPUP_REQUEST));
    postMessage(createPopupMessage(POPUP.CANCEL_POPUP_REQUEST));
};

export const postSuccessCancelPopupRequest = (postMessage: (message: CoreMessage) => void) => {
    postMessage(createPopupMessage(POPUP.SUCCESS_CANCEL_POPUP_REQUEST));
    postMessage(createPopupMessage(POPUP.CANCEL_POPUP_REQUEST));
};
