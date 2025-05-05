import { Contact } from './types';

type Callback = (data: any) => void;

interface Listener {
    resolve: Callback;
    reject: Callback;
}

interface NativeMessage {
    id: number;
    type: string;
    payload?: any;
    error?: any;
}

const listeners: Record<number, Listener> = {};
let callId = 0;

function callNative<T = any>(type: string, payload: any = {}): Promise<T> {
    if (
        typeof window === 'undefined' ||
        !window.__CZ_NATIVE ||
        !window.__CZ_NATIVE.postMessage
    ) {
        return Promise.reject(new Error('Not running inside Converzilla'));
    }

    const id = ++callId;

    return new Promise<T>((resolve, reject) => {
        listeners[id] = { resolve, reject };
        window.__CZ_NATIVE?.postMessage(
            JSON.stringify({ id, type, payload })
        );
    });
}

if (typeof window !== 'undefined') {
    window.addEventListener('message', (event) => {
        try {
            const message: NativeMessage = JSON.parse(event.data);
            const { id, payload, error } = message;

            if (listeners[id]) {
                if (error) {
                    listeners[id].reject(error);
                } else {
                    listeners[id].resolve(payload);
                }
                delete listeners[id];
            }
        } catch (err) {
            console.error('Failed to process message:', err);
        }
    });
}

const converzilla = {
    getContacts(): Promise<Contact[]> {
        return callNative<Contact[]>('getContacts');
    },

    getUserId(): Promise<string> {
        return callNative<string>('getUserId');
    }
};
export default converzilla;