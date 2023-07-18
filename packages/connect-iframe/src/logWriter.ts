// @ts-expect-error (typescript does not know this is worker constructor, this is done by webpack)
import LogWorker from './sharedLoggerWorker';
import { LogMessage, LogWriter } from '@trezor/connect/src/utils/debug';

const logWorker = new LogWorker();
logWorker.port.start();

const stringify = (obj: Record<string, any>) => {
    let cache: string[] = [];
    const str = JSON.stringify(obj, (_key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = [];
    return str;
};

const prepareMessage = (message: LogMessage) => {
    const { level, prefix, timestamp, css, ...rest } = message;
    return {
        level,
        prefix,
        timestamp,
        message: JSON.parse(stringify(rest)),
    };
};

export const logWriter = (): LogWriter => ({
    add: (message: LogMessage) =>
        logWorker.port.postMessage({ type: 'add-log', data: prepareMessage(message) }),
});
