function task1_swapXY() {
    const blockX = document.getElementById('blockX');
    const blockY = document.getElementById('blockY');

    if (blockX && blockY) {
        const tempContent = blockX.innerHTML;
        blockX.innerHTML = blockY.innerHTML;
        blockY.innerHTML = tempContent;
        console.log('Task 1: Content of blocks X and Y has been swapped.');
    }
}

function task2_parallelogramArea() {

    const base = 15;    
    const height = 8;   

    const area = base * height;

    const areaResultDiv = document.getElementById('areaResult');
    if (areaResultDiv) {
        areaResultDiv.innerHTML = `
            <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 10px 0;">
                <h4>Task 2: Parallelogram Area Calculation</h4>
                <p><strong>Base:</strong> ${base}</p>
                <p><strong>Height:</strong> ${height}</p>
                <p><strong>Area (base × height):</strong> ${area}</p>
            </div>
        `;
        console.log(`Task 2: Parallelogram area = ${area} (base=${base}, height=${height})`);
    }
}

const COOKIE_NAME = 'wordCountResult';

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function task3_wordCount() {
    const wordCountSection = document.getElementById('wordCountSection');
    const wordCountForm = document.getElementById('wordCountForm');
    const textInput = document.getElementById('textInput');

    const savedResult = getCookie(COOKIE_NAME);

    if (savedResult) {
        if (wordCountForm) {
            wordCountForm.style.display = 'none';
        }
        alert(`Saved word count result from cookies:\n\n${savedResult}\n\nClicking "OK" will delete the cookies.`);

        deleteCookie(COOKIE_NAME);

        alert('Cookies have been deleted!\n\nClicking "OK" will reload the page with the initial state.');

        window.location.reload();
        return;
    }
    if (wordCountForm) {
        wordCountForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const text = textInput.value.trim();

            if (!text) {
                alert('Please enter some text to count words.');
                return;
            }
            const words = text.split(/\s+/).filter(word => word.length > 0);
            const wordCount = words.length;
            const resultMessage = `Text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"\nWord count: ${wordCount}`;

            alert(`Word Count Result:\n\n${resultMessage}`);

            setCookie(COOKIE_NAME, resultMessage, 7);

            console.log(`Task 3: Word count = ${wordCount}, saved to cookies`);
        });
    }
}

const BLOCK2_COLOR_KEY = 'block2BackgroundColor';

function task4_block2Background() {
    const block2 = document.getElementById('block2');
    const colorPicker = document.getElementById('colorPicker');

    if (!block2 || !colorPicker) return;

    const savedColor = localStorage.getItem(BLOCK2_COLOR_KEY);
    if (savedColor) {
        block2.style.backgroundColor = savedColor;
        colorPicker.value = savedColor;
        console.log(`Task 4: Restored block 2 background color from localStorage: ${savedColor}`);
    }
    block2.addEventListener('mouseout', function() {
        const selectedColor = colorPicker.value;
        block2.style.backgroundColor = selectedColor;
        localStorage.setItem(BLOCK2_COLOR_KEY, selectedColor);
        console.log(`Task 4: Block 2 background changed to ${selectedColor} on mouseout`);
    });
}

const BG_IMAGE_PREFIX = 'blockBgImage_';

function hasTextNodes(element) {
    for (const node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
            return true;
        }
        if (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim().length > 0) {
            return true;
        }
    }
    return false;
}

function task5_backgroundImages() {
    const containerList = document.getElementById('containerList');

    if (!containerList) return;
    restoreBackgroundImages();
    containerList.addEventListener('click', function(e) {
        if (e.target.tagName === 'LI') {
            const blockId = e.target.getAttribute('data-block');
            showBackgroundForm(blockId);
        }
    });
}

function restoreBackgroundImages() {
    const blocks = ['block1', 'block2', 'block3', 'block4', 'block5'];

    blocks.forEach(blockId => {
        const savedBgUrl = localStorage.getItem(BG_IMAGE_PREFIX + blockId);
        if (savedBgUrl) {
            const block = document.getElementById(blockId);
            if (block) {
                block.style.backgroundImage = `url(${savedBgUrl})`;
                block.style.backgroundSize = 'cover';
                block.style.backgroundRepeat = 'no-repeat';
                console.log(`Task 5: Restored background image for ${blockId}`);
            }
        }
    });
}

function showBackgroundForm(blockId) {
    const block = document.getElementById(blockId);
    if (!block) return;

    if (!hasTextNodes(block)) {
        alert(`Block ${blockId} does not have text content. Cannot add background image.`);
        return;
    }
    const existingForm = block.querySelector('.bg-image-form');
    if (existingForm) {
        existingForm.remove();
        return; 
    }
    const formDiv = document.createElement('div');
    formDiv.className = 'bg-image-form';
    formDiv.innerHTML = `
        <h4>Background Image for ${blockId}</h4>
        <input type="text" id="bgUrl_${blockId}" placeholder="Enter image URL..."
               value="${localStorage.getItem(BG_IMAGE_PREFIX + blockId) || ''}">
        <br>
        <button id="saveBg_${blockId}">Save Background</button>
        <button id="deleteBg_${blockId}">Remove Background</button>
    `;

    block.appendChild(formDiv);
    document.getElementById(`saveBg_${blockId}`).addEventListener('click', function() {
        const urlInput = document.getElementById(`bgUrl_${blockId}`);
        const url = urlInput.value.trim();

        if (!url) {
            alert('Please enter a valid image URL.');
            return;
        }
        block.style.backgroundImage = `url(${url})`;
        block.style.backgroundSize = 'cover';
        block.style.backgroundRepeat = 'no-repeat';

        localStorage.setItem(BG_IMAGE_PREFIX + blockId, url);

        alert(`Background image saved for ${blockId}!`);
        console.log(`Task 5: Saved background image for ${blockId}: ${url}`);
    });

    document.getElementById(`deleteBg_${blockId}`).addEventListener('click', function() {
        block.style.backgroundImage = 'none';

        localStorage.removeItem(BG_IMAGE_PREFIX + blockId);

        document.getElementById(`bgUrl_${blockId}`).value = '';

        alert(`Background image removed from ${blockId}!`);
        console.log(`Task 5: Removed background image from ${blockId}`);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Lab 5 - Variant 16 - Initializing...');

    task1_swapXY();
    task2_parallelogramArea();
    task3_wordCount();
    task4_block2Background();
    task5_backgroundImages();

    console.log('Lab 5 - Variant 16 - All tasks initialized.');
});
