import { t } from '@i18n/index.js';
import { CLASSES } from '@editor/classes.js';

export function createInputs(form) {
    const keyInput = document.createElement('input');
    keyInput.className = CLASSES.formInput;
    keyInput.placeholder = t.labels.newKey;

    const typeSelect = document.createElement('select');
    typeSelect.className = CLASSES.formSelect;
    ['string', 'number', 'boolean', 'array', 'object', 'textarea'].forEach(opt => {
        const o = document.createElement('option');
        o.value = opt;
        o.textContent = opt;
        typeSelect.appendChild(o);
    });

    const valueContainer = document.createElement('div');
    valueContainer.className = CLASSES.addArea;

    const createBtn = document.createElement('button');
    createBtn.className = CLASSES.btnCreate;
    createBtn.textContent = t.buttons.create;

    const cancelBtn = document.createElement('button');
    cancelBtn.className = CLASSES.btnCancel;
    cancelBtn.textContent = t.buttons.cancel;

    const errorEl = document.createElement('div');
    errorEl.className = CLASSES.errorMessage;
    errorEl.style.display = 'none';

    form.append(keyInput, typeSelect, valueContainer, createBtn, cancelBtn, errorEl);

    return { keyInput, typeSelect, valueContainer, createBtn, cancelBtn, errorEl };
}
