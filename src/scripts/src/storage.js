import browser from 'webextension-polyfill';

const storageArea = browser.storage.local;

export function save(key, value) {
    return storageArea.set({ [key]: value });
}

export function restore(key, defaultValue) {
    return storageArea.get({ [key]: defaultValue }).then((items) => items[key]);
}
