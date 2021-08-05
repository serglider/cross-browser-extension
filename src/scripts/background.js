import browser from 'webextension-polyfill';

console.log(browser.browserAction.onClicked.dispatch());

console.log(42);

// browser.browserAction.onClicked.addListener(() => {
//     console.log(42);
// });
