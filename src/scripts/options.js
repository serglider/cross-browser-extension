import { save, restore } from './src/storage';

const newWordInput = document.getElementById('new-word-input');
const addButton = document.getElementById('add-word');
const textsBlock = document.getElementById('texts');
let searchList = [];

addButton.disabled = true;

restore('searchList', []).then((list) => {
    searchList = list;
    newWordInput.oninput = onInput;
    textsBlock.onclick = deleteText;
    addButton.onclick = addText;
    updateTextBlock();
});

function update() {
    updateTextBlock();

    save('searchList', searchList);

    setTimeout(() => {
        restore('searchList', []).then((list) => {
            console.log(list);
        });
    }, 1000);
}

function updateTextBlock() {
    textsBlock.innerHTML = searchList.reduce((html, text) => {
        html += getItemHTML(text);
        return html;
    }, '');
}

function addText() {
    searchList.unshift(newWordInput.value);
    update();
    newWordInput.value = '';
    onInput();
}

function deleteText(e) {
    const el = e.target;
    if (el.classList.contains('delete')) {
        const text = el.parentNode.querySelector('.content').textContent;
        searchList = searchList.filter((item) => item !== text);
        update();
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
