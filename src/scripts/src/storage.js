import browser from 'webextension-polyfill';

export function save(key, value) {
    browser.storage.local.set({
        [key]: value,
    });
}

export function restore(key, defaultValue) {
    return browser.storage.local
        .get({
            [key]: defaultValue,
        })
        .then((items) => items[key]);
}
