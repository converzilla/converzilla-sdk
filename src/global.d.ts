interface CZNativeBridge {
    postMessage(message: string): void;
}

interface Window {
    __CZ_NATIVE?: CZNativeBridge;
    converzilla?: {
        getContacts(): Promise<Contact[]>;
    }
}