function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function displayResults(x, y, problemResult, textCount, isFromCookie) {
    const additionalContentDiv = document.getElementById('additional_content');
    if (!additionalContentDiv) return;

    let content = `
        <h3>Результати Варіанту 16 (Обчислення)</h3>
        <p>1. Вміст блоків "x" та "y" (після обміну): </p>
        <ul>
            <li>**x** (Контент блоку 1): "${x.substring(0, 30)}..."</li>
            <li>**y** (Контент блоку 4): "${y.substring(0, 30)}..."</li>
        </ul>
        <p>2. Площа паралелограма (довжина x * довжина y): **${problemResult}**</p>
        <p>3. Кількість слів у тексті (блоку 3): **${textCount}**</p>
    `;

    if (isFromCookie) {
        content += `<p style="color: green;">* Результат відновлено з cookie.</p>`;
    } else {
        content += `<p style="color: blue;">* Новий результат обчислено та збережено в cookie.</p>`;
    }

    additionalContentDiv.innerHTML = content;
}

function runTask123() {
    const block1 = document.getElementById('block1');
    const block4 = document.getElementById('block4');
    const block3 = document.getElementById('block3');
    const cookieName = 'assignment16_results';

    if (!block1 || !block4 || !block3) {
        console.error('Не знайдено необхідних блоків (1, 3, 4) для Завдання 1-3.');
        return;
    }
    
    const cookieData = getCookie(cookieName);

    if (cookieData) {
        const parsedData = JSON.parse(cookieData);
        displayResults(parsedData.x, parsedData.y, parsedData.area, parsedData.wordCount, true);

        const confirmDelete = confirm(`
            Інформація збережена в cookies.
            Натисніть "ОК", щоб видалити дані cookies, або "Скасувати", щоб зберегти.
        `);

        if (confirmDelete) {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            alert("Cookies видалено! Натискання «ОК» перезавантажує веб-сторінку.");
            window.location.reload();
        }

    } else {
        const content1 = block1.innerHTML; 
        const content4 = block4.innerHTML; 
        block1.innerHTML = content4; 
        block4.innerHTML = content1; 

        const x = block1.textContent.trim();
        const y = block4.textContent.trim();

        const base = x.length;
        const height = y.length;
        const area = base * height; 

        const textBlock3 = block3.textContent;
        const words = textBlock3.match(/\b\w+\b/g);
        const wordCount = words ? words.length : 0;

        const newResultData = JSON.stringify({ x: x, y: y, area: area, wordCount: wordCount });
        const date = new Date();
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000)); 
        const expires = "; expires=" + date.toUTCString();
        document.cookie = `${cookieName}=${newResultData}${expires}; path=/`;

        displayResults(x, y, area, wordCount, false);
    }
}

function setupTask4() {
    const block2 = document.getElementById('block2');
    const storageKey = 'block2BackgroundColor';

    if (!block2) return;

    const savedColor = localStorage.getItem(storageKey);
    if (savedColor) {
        block2.style.backgroundColor = savedColor;
    }

    const changeColor = () => {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        block2.style.backgroundColor = randomColor;
        localStorage.setItem(storageKey, randomColor);
    };

    block2.addEventListener('mouseout', changeColor);
    block2.addEventListener('click', changeColor); 
}

function setupTask5() {
    const block3 = document.getElementById('block3');
    if (!block3) return;

    const containerList = document.createElement('ol');
    containerList.style.marginTop = '20px';
    containerList.style.cursor = 'pointer';
    containerList.innerHTML = `
        <li data-block="1">1. Блок 1 (Header)</li>
        <li data-block="2">2. Блок 2 (Menu)</li>
        <li data-block="3">3. Блок 3 (Content)</li>
        <li data-block="4">4. Блок 4 (Footer)</li>
        <li data-block="5">5. Блок 5 (Contact)</li>
    `;
    block3.appendChild(containerList);

    function hasTextNodes(block) {
        return Array.from(block.childNodes).some(node => 
            node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
        );
    }

    function addFormToBlock(blockId, blockNumber) {
        const targetBlock = document.getElementById(blockId);
        if (!targetBlock) return;

        const existingForm = targetBlock.querySelector('.bg-form');
        if (existingForm) {
            existingForm.remove();
        }

        const formDiv = document.createElement('div');
        formDiv.className = 'bg-form';
        formDiv.style.padding = '10px';
        formDiv.style.marginTop = '10px';
        formDiv.style.border = '1px dashed red';
        formDiv.innerHTML = `<h4>Управління фоном Блоку ${blockNumber}</h4>`;

        const inputUrl = document.createElement('input');
        inputUrl.type = 'text';
        inputUrl.placeholder = 'Введіть URL фонового зображення';
        inputUrl.style.display = 'block';
        inputUrl.style.width = '90%';
        inputUrl.style.marginBottom = '5px';
        inputUrl.value = localStorage.getItem(`block${blockNumber}_bg`) || ''; 
        formDiv.appendChild(inputUrl);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Зберегти фон';
        saveButton.style.marginRight = '10px';
        formDiv.appendChild(saveButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Видалити фон';
        formDiv.appendChild(deleteButton);

        targetBlock.appendChild(formDiv);

        saveButton.addEventListener('click', () => {
            const url = inputUrl.value.trim();
            if (url) {
                if (hasTextNodes(targetBlock)) {
                    targetBlock.style.backgroundImage = `url(${url})`;
                    targetBlock.style.backgroundSize = 'cover';
                    targetBlock.style.backgroundRepeat = 'no-repeat';
                    localStorage.setItem(`block${blockNumber}_bg`, url);
                    alert(`Фон для Блоку ${blockNumber} збережено.`);
                } else {
                    alert(`Помилка: Блок ${blockNumber} не містить текстових вузлів. Зображення не додано.`);
                }
            } else {
                 alert('Введіть коректний URL.');
            }
        });

        deleteButton.addEventListener('click', () => {
            targetBlock.style.backgroundImage = 'none';
            localStorage.removeItem(`block${blockNumber}_bg`);
            inputUrl.value = '';
            alert(`Фон для Блоку ${blockNumber} видалено.`);
        });
    }

    containerList.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            const actualBlockNumber = parseInt(event.target.getAttribute('data-block'));
            const blockId = `block${actualBlockNumber}`;

            addFormToBlock(blockId, actualBlockNumber);
        }
    });

    function restoreBackgrounds() {
        for (let i = 1; i <= 5; i++) {
            const savedBg = localStorage.getItem(`block${i}_bg`);
            if (savedBg) {
                const block = document.getElementById(`block${i}`);
                if (block) {
                    block.style.backgroundImage = `url(${savedBg})`;
                    block.style.backgroundSize = 'cover';
                    block.style.backgroundRepeat = 'no-repeat';
                }
            }
        }
    }
    
    restoreBackgrounds();
}

document.addEventListener('DOMContentLoaded', () => {
    runTask123(); 
    setupTask4(); 
    setupTask5();
});
