import { Contact } from './types';
declare const converzilla: {
    getContacts(): Promise<Contact[]>;
    getUserId(): Promise<string>;
};
export default converzilla;
