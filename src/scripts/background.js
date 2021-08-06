import browser from 'webextension-polyfill';

browser.browserAction.onClicked.addListener((tab) => {
    browser.tabs.sendMessage(tab.id, 'highlight');
});
