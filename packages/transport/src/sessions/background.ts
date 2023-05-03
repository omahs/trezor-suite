/**
 * Goals:
 * - synchronize exclusive access to device (locks)
 * - ensure device has not changed without other clients realizing (sessions).
 *
 * Concepts:
 * - we have no control about the async process between lock and unlock, it happens elsewhere
 * - caller has the responsibility to lock and unlock
 * - we can say we trust the caller but not really thats why we implement auto-unlock
 */

import { createDeferred, Deferred } from '@trezor/utils';

import { TypedEmitter } from '../types/typed-emitter';

import type {
    EnumerateDoneRequest,
    AcquireIntentRequest,
    AcquireDoneRequest,
    ReleaseIntentRequest,
    ReleaseDoneRequest,
    GetPathBySessionRequest,
    HandleMessageParams,
    HandleMessageResponse,
    Sessions,
} from './types';
import type { Descriptor, Success } from '../types';

import * as ERRORS from '../errors';

// in nodeusb, enumeration operation takes ~3 seconds
const lockDuration = 1000 * 4;

export class SessionsBackground extends TypedEmitter<{
    /**
     * updated descriptors (session has changed)
     * note: we can't send diff from here (see abtract transport) altough it would make sense, because we need to support also bridge which  does not use this sessions background.
     */
    ['descriptors']: Descriptor[];
}> {
    /**
     * Dictionary where key is path and value is session
     */
    private sessions: Sessions = {};

    // if lock is set, somebody is doing something with device. we have to wait
    private locksQueue: Deferred<any>[] = [];
    private locksTimeoutQueue: ReturnType<typeof setTimeout>[] = [];

    private lastSession = 0;

    public async handleMessage<M extends HandleMessageParams>(
        message: M,
    ): Promise<HandleMessageResponse<M>> {
        let result;

        try {
            // future:
            // once we decide that we want to have sessions synchronization also between browser tabs and
            // desktop application, here should go code that will check if some "master" sessions background
            // is alive (websocket server in suite desktop). If yes, it will simply forward request

            // @ts-ignore
            console.log('request ', `${message.id}-${message.caller}`, message.type, message.payload);
            console.time(`${message.id}-${message.caller}`);

            switch (message.type) {
                case 'handshake':
                    result = this.handshake();
                    break;
                case 'enumerateIntent':
                    result = await this.enumerateIntent();
                    break;
                case 'enumerateDone':
                    result = await this.enumerateDone(message.payload);
                    break;
                case 'acquireIntent':
                    result = await this.acquireIntent(message.payload, message.caller!);
                    break;
                case 'acquireDone':
                    result = await this.acquireDone(message.payload);
                    break;
                case 'getSessions':
                    result = await this.getSessions();
                    break;
                case 'releaseIntent':
                    result = await this.releaseIntent(message.payload);
                    break;
                case 'releaseDone':
                    result = await this.releaseDone(message.payload);
                    break;
                case 'getPathBySession':
                    result = this.getPathBySession(message.payload);
                    break;
                default:
                    throw new Error(ERRORS.UNEXPECTED_ERROR);
            }


            // if (result && result.success && result.payload && 'descriptors' in result.payload) {
            //     const { descriptors } = result.payload; 
            //     // finally would do the same job, wouldn't it?
            //     Promise.resolve().then(() => {
                    
            //         // @ts-ignore
            //         this.emit('descriptors', descriptors);
            //     });
            // }

            console.log('result ', `${message.id}-${message.caller}`, message.type, result);
            console.timeEnd(`${message.id}-${message.caller}`);

            return { ...result, id: message.id } as HandleMessageResponse<M>;
        } catch (err) {
            // catch unexpected errors and notify client.
            // background should never stay in "hanged" state
            return {
                ...this.error(ERRORS.UNEXPECTED_ERROR),
                id: message.type,
            } as HandleMessageResponse<M>;
        } finally {
             if (result && result.success && result.payload && 'descriptors' in result.payload) {
                const { descriptors } = result.payload; 
                // finally would do the same job, wouldn't it?
                // Promise.resolve().then(() => {
                    
                    // @ts-ignore
                    setTimeout(() => this.emit('descriptors', descriptors), 0);
                // });
            }

        }
    }

    private handshake() {
        return this.success(undefined);
    }
    /**
     * enumerate intent
     * - caller wants to enumerate usb
     * - basically "wait for unlocked and lock"
     */
    async enumerateIntent() {
        await this.waitInQueue();

        return this.success({ sessions: this.sessions });
    }

    /**
     * enumerate done
     * - caller will not be touching usb anymore
     * - caller informs about disconnected devices so that they may be removed from sessions list
     */
    private enumerateDone(payload: EnumerateDoneRequest) {
        this.clearLock();
        const disconnectedDevices = this.filterDisconnectedDevices(
            this.sessionsToDescriptors(),
            payload.paths,
        );
        disconnectedDevices.forEach(d => {
            delete this.sessions[d.path];
        });

        payload.paths.forEach(d => {
            if (!this.sessions[d]) {
                this.sessions[d] = undefined;
            }
        });

        const descriptors = this.sessionsToDescriptors();

        return Promise.resolve(
            this.success({
                sessions: this.sessions,
                descriptors,
            }),
        );
    }

    /**
     * acquire intent
     */
    private async acquireIntent(payload: AcquireIntentRequest, caller: string) {

        // null
        const unconfirmedSessions = JSON.parse(JSON.stringify(this.sessions));
        const previous = this.sessions[payload.path]
        
        console.log(caller, 'previous ref', previous);
        console.log(caller, 'pre', JSON.stringify(this.sessions));
        
        if (payload.previous && payload.previous !== previous) {
            return this.error(ERRORS.SESSION_WRONG_PREVIOUS);
        }

        await this.waitInQueue();

        console.log(caller, 'post', JSON.stringify(this.sessions));

        if (previous !== this.sessions[payload.path]) {
            return this.error(ERRORS.SESSION_WRONG_PREVIOUS);
        }
        
       
        const id = `${this.getNewSessionId()}`;
        unconfirmedSessions[payload.path] = id;

        const descriptors = this.sessionsToDescriptors(unconfirmedSessions);

        return this.success({ session: id, descriptors });
    }

    /**
     * client notified backend that he is able to talk to device
     * - assign client a new "session". this session will be used in all subsequent communication
     */
    // @ts-ignore
    private acquireDone(payload: AcquireDoneRequest) {
        this.clearLock();
        // const id = `${this.getNewSessionId()}`;
        // this.sessions[payload.path] = id;
        this.sessions[payload.path] = `${this.lastSession}`;

        // const descriptors = this.sessionsToDescriptors();

        return Promise.resolve(
            this.success({
                // session: this.sessions[payload.path] as string,
                // descriptors,
            }),
        );
    }

    private async releaseIntent(payload: ReleaseIntentRequest) {
        const path = this._getPathBySession({ session: payload.session });

        if (!path) {
            return this.error(ERRORS.SESSION_NOT_FOUND);
        }

        await this.waitInQueue();

        return this.success({ path });
    }

    private releaseDone(payload: ReleaseDoneRequest) {
        this.sessions[payload.path] = null;

        this.clearLock();
        const descriptors = this.sessionsToDescriptors();
        return Promise.resolve(this.success({ descriptors }));
    }

    private getSessions() {
        return Promise.resolve(this.success({ sessions: this.sessions }));
    }

    private getPathBySession({ session }: GetPathBySessionRequest) {
        const path = this._getPathBySession({ session });
        if (!path) {
            return this.error(ERRORS.SESSION_NOT_FOUND);
        }
        return this.success({ path });
    }

    private _getPathBySession({ session }: GetPathBySessionRequest) {
        let path: string | undefined;
        Object.keys(this.sessions).forEach(pathKey => {
            if (this.sessions[pathKey] === session) {
                path = pathKey;
            }
        });
        return path;
    }

    private startLock() {
        // todo: create a deferred with built-in timeout functionality (util)
        const dfd = createDeferred<any>();

        // to ensure that communication with device will not get stuck forever,
        // lock times out:
        // - if cleared by client (enumerateIntent, enumerateDone)
        // - after n second automatically
        const timeout = setTimeout(() => {
            console.error('[backend]: resolving lock after timeout! should not happen');
            dfd.resolve(undefined);
        }, lockDuration);

        this.locksQueue.push(dfd);
        this.locksTimeoutQueue.push(timeout);

        return this.locksQueue.length - 1;
    }

    private clearLock() {
        const lock = this.locksQueue[0];
        if (lock) {
            this.locksQueue[0].resolve(undefined);
            this.locksQueue.shift();
            clearTimeout(this.locksTimeoutQueue[0]);
            this.locksTimeoutQueue.shift();
        } else {
            // should never happen if implemented correctly by all clients
            console.warn('empty lock queue');
        }
    }

    private async waitForUnlocked(myIndex: number) {
        if (myIndex > 0) {
            const beforeMe = this.locksQueue.slice(0, myIndex);
            if (beforeMe.length) {
                await Promise.all(beforeMe.map(dfd => dfd.promise));
            }
        }
    }

    private async waitInQueue() {
        const myIndex = this.startLock();
        await this.waitForUnlocked(myIndex);
    }

    private getNewSessionId() {
        this.lastSession++;
        return this.lastSession;
    }

    private sessionsToDescriptors(sessions?: Sessions): Descriptor[] {
        return Object.entries(sessions || this.sessions).map(obj => ({
            path: obj[0],
            session: obj[1],
        }));
    }

    private filterDisconnectedDevices(prevDevices: Descriptor[], paths: string[]) {
        return prevDevices.filter(d => !paths.find(p => d.path === p));
    }

    private success<T>(payload: T): Success<T> {
        return {
            success: true as const,
            payload,
        };
    }

    private error<E>(error: E) {
        return {
            success: false as const,
            error,
        };
    }
}
