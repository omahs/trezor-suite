import React from 'react';
import { MODAL } from 'src/actions/suite/constants';
import { ConfirmNoBackup } from 'src/components/suite/modals';

import type { ReduxModalProps } from './types';

/** Modals requested from `trezor-connect` */
export const DeviceConfirmationModal = ({
    windowType,
    renderer,
}: ReduxModalProps<typeof MODAL.CONTEXT_DEVICE_CONFIRMATION>) => {
    switch (windowType) {
        case 'no-backup':
            return <ConfirmNoBackup buttonText="TR_SHOW_ADDRESS_ANYWAY" renderer={renderer} />;
        case 'get-public-key-no-backup':
            return <ConfirmNoBackup buttonText="TR_SHOW_XPUB_ANYWAY" renderer={renderer} />;
        default:
            return null;
    }
};
