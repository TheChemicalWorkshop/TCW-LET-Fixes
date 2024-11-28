// Save a selector to storage
async function saveSelector(selector) {
    const { selectors = [] } = await browser.storage.local.get('selectors');
    selectors.push(selector);
    await browser.storage.local.set({ selectors });
    renderSelectors();
}

// Load all selectors from storage
async function loadSelectors() {
    const { selectors = [] } = await browser.storage.local.get('selectors');
    return selectors;
}

// Validate HEX color input
function isValidHex(color) {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
}

// Render the list of selectors
async function renderSelectors() {
    const selectors = await loadSelectors();
    const list = document.getElementById('selectorsList');
    list.innerHTML = ''; // Clear existing list

    selectors.forEach((selector, index) => {
        const div = document.createElement('div');
        div.className = 'selector-item';

        div.innerHTML = `
            <input type="text" value="${selector.name}" class="edit-name" data-index="${index}">
            <input type="text" value="${selector.color}" class="edit-color" data-index="${index}" maxlength="7" placeholder="#ffffff">
            <label>
                <input type="checkbox" class="edit-ignore" data-index="${index}" ${selector.ignore ? 'checked' : ''}>
                Ignore
            </label>
            <button data-index="${index}" class="delete">Delete</button>
        `;

        list.appendChild(div);
    });

    // Attach event listeners for editing and deleting
    document.querySelectorAll('.edit-name').forEach(input => {
        input.addEventListener('change', async (event) => {
            const index = event.target.dataset.index;
            await updateSelector(index, { name: event.target.value });
        });
    });

    document.querySelectorAll('.edit-color').forEach(input => {
        input.addEventListener('change', async (event) => {
            const index = event.target.dataset.index;
            const newColor = event.target.value;
            if (!isValidHex(newColor)) {
                alert('Please enter a valid HEX color (e.g., #ff5733).');
                return;
            }
            await updateSelector(index, { color: newColor });
        });
    });

    document.querySelectorAll('.edit-ignore').forEach(input => {
        input.addEventListener('change', async (event) => {
            const index = event.target.dataset.index;
            await updateSelector(index, { ignore: event.target.checked });
        });
    });

    document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', async (event) => {
            const index = event.target.dataset.index;
            await deleteSelector(index);
        });
    });
}

// Update a selector by index
async function updateSelector(index, updates) {
    const { selectors = [] } = await browser.storage.local.get('selectors');
    Object.assign(selectors[index], updates); // Update selector with new values
    await browser.storage.local.set({ selectors });
    renderSelectors();
}

// Delete a selector by index
async function deleteSelector(index) {
    const { selectors = [] } = await browser.storage.local.get('selectors');
    selectors.splice(index, 1); // Remove the selector
    await browser.storage.local.set({ selectors });
    renderSelectors();
}

// Handle adding a new selector
document.getElementById('addSelector').addEventListener('click', async () => {
    const name = document.getElementById('selectorName').value.trim();
    const color = document.getElementById('selectorColor').value.trim();
    const ignore = document.getElementById('selectorIgnore').checked;

    if (!name) {
        alert('Please enter a selector name.');
        return;
    }

    if (!isValidHex(color)) {
        alert('Please enter a valid HEX color (e.g., #ff5733).');
        return;
    }

    await saveSelector({ name, color, ignore });

    // Clear inputs
    document.getElementById('selectorName').value = '';
    document.getElementById('selectorColor').value = '#ffffff';
    document.getElementById('selectorIgnore').checked = false;
});

// Load and render selectors on page load
document.addEventListener('DOMContentLoaded', renderSelectors);