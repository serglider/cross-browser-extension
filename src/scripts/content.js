import browser from 'webextension-polyfill';
import { restore } from './src/storage';

let isSelected = false;

browser.runtime.onMessage.addListener((event) => {
    if (event === 'highlight') {
        if (isSelected) {
            unhighlight();
        } else {
            highlight();
        }
        isSelected = !!isSelected;
    }
});

function unhighlight() {
    restore('searchList', []).then((searchList) => {
        document.body.innerHTML = searchList.reduce((html, query) => {
            const mark = `<mark>${query}</mark>`;
            const re = new RegExp(mark, 'g');
            return html.replace(re, query);
        }, document.body.innerHTML);
    });
}

function highlight() {
    restore('searchList', []).then((searchList) => {
        document.body.innerHTML = searchList.reduce((html, query) => {
            const re = new RegExp(query, 'g');
            return html.replace(re, `<mark>${query}</mark>`);
        }, document.body.innerHTML);
    });
}
