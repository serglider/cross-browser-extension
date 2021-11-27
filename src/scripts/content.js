import { runtime } from 'webextension-polyfill';
import { restore } from './src/storage';
import { HIGHLIGHT_EVENT, LIST_NAME } from './src/constants';

let isHighlighted = false;
let searchList;

runtime.onMessage.addListener(onMessage);

function onMessage(e) {
    if (e === HIGHLIGHT_EVENT) {
        if (isHighlighted) {
            unhighlight();
        } else {
            restore(LIST_NAME, []).then((list) => {
                searchList = list;
                highlight();
            });
        }
    }
}

function unhighlight() {
    isHighlighted = false;
    document.body.innerHTML = searchList.reduce(highlightItem, document.body.innerHTML);
}

function highlight() {
    isHighlighted = true;
    document.body.innerHTML = searchList.reduce(unhighlightItem, document.body.innerHTML);
}

function unhighlightItem(html, query) {
    const mark = `<mark>${query}</mark>`;
    const re = new RegExp(mark, 'g');
    return html.replace(re, query);
}

function highlightItem(html, query) {
    const re = new RegExp(query, 'g');
    return html.replace(re, `<mark>${query}</mark>`);
}
