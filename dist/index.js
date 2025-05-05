const listeners = {};
let callId = 0;
function callNative(type, payload = {}) {
    if (typeof window === 'undefined' ||
        !window.__CZ_NATIVE ||
        !window.__CZ_NATIVE.postMessage) {
        return Promise.reject(new Error('Not running inside Converzilla'));
    }
    const id = ++callId;
    return new Promise((resolve, reject) => {
        var _a;
        listeners[id] = { resolve, reject };
        (_a = window.__CZ_NATIVE) === null || _a === void 0 ? void 0 : _a.postMessage(JSON.stringify({ id, type, payload }));
    });
}
if (typeof window !== 'undefined') {
    window.addEventListener('message', (event) => {
        try {
            const message = JSON.parse(event.data);
            const { id, payload, error } = message;
            if (listeners[id]) {
                if (error) {
                    listeners[id].reject(error);
                }
                else {
                    listeners[id].resolve(payload);
                }
                delete listeners[id];
            }
        }
        catch (err) {
            console.error('Failed to process message:', err);
        }
    });
}
const converzilla = {
    getContacts() {
        return callNative('getContacts');
    },
    getUserId() {
        return callNative('getUserId');
    }
};
export default converzilla;
