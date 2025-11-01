import { t } from '@i18n/index.js';

export function createInputs(form) {
    const keyInput = document.createElement('input');
    keyInput.className = 'form-control form-control-sm';
    keyInput.placeholder = t.labels.newKey;

    const typeSelect = document.createElement('select');
    typeSelect.className = 'form-select form-select-sm';
    ['string', 'number', 'boolean', 'array', 'object', 'textarea'].forEach(opt => {
        const o = document.createElement('option');
        o.value = opt;
        o.textContent = opt;
        typeSelect.appendChild(o);
    });

    const valueContainer = document.createElement('div');
    valueContainer.className = 'mt-2';

    const createBtn = document.createElement('button');
    createBtn.className = 'btn btn-sm btn-success me-2';
    createBtn.textContent = t.buttons.create;

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-sm btn-secondary';
    cancelBtn.textContent = t.buttons.cancel;

    const errorEl = document.createElement('div');
    errorEl.className = 'text-danger small mt-1';
    errorEl.style.display = 'none';

    form.append(keyInput, typeSelect, valueContainer, createBtn, cancelBtn, errorEl);

    return { keyInput, typeSelect, valueContainer, createBtn, cancelBtn, errorEl };
}
