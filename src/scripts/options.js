import { save, restore } from './src/storage';
import { LIST_NAME } from './src/constants';

const newWordInput = document.getElementById('new-word-input');
const addButton = document.getElementById('add-word');
const textsBlock = document.getElementById('texts');
let searchList = [];

addButton.disabled = true;

restore(LIST_NAME, []).then((list) => {
    searchList = list;
    newWordInput.oninput = onInput;
    textsBlock.onclick = deleteText;
    addButton.onclick = addText;
    updateTextBlock();
});

function updateTextBlock() {
    textsBlock.innerHTML = searchList.reduce((html, text) => {
        html += getItemHTML(text);
        return html;
    }, '');
}

function addText() {
    searchList.unshift(newWordInput.value);
    newWordInput.value = '';
    addButton.disabled = true;
    save(LIST_NAME, searchList).then(updateTextBlock);
}

function deleteText(e) {
    const el = e.target;
    if (el.classList.contains('delete')) {
        const text = el.parentNode.querySelector('.content').textContent;
        searchList = searchList.filter((item) => item !== text);
        save(LIST_NAME, searchList).then(updateTextBlock);
    }
}

function onInput() {
    addButton.disabled = !newWordInput.value;
}

function getItemHTML(text) {
    return `
            <div class='text'>
                <span class='content'>${text}</span>
                <span class='delete'>X</span>
            </div>   
    `;
}
