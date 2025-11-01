import { createInputs } from './inputs.js';
import { validateKey } from './validation.js';
import { buildLayout } from './layout.js';
import { resetForm } from './helpers.js';
import { t } from '@i18n/index.js';

export function createAddForm(node, path, rowsContainer, objectOrders, onChange, onCancel, buildSection, expandState) {
    const form = buildLayout();

    const { keyInput, typeSelect, valueContainer, createBtn, cancelBtn, errorEl } = createInputs(form);

    const validateAndCreate = () => {
        const key = keyInput.value.trim();
        const type = typeSelect.value;

        const validation = validateKey(key, node, objectOrders);
        if (!validation.valid) {
            errorEl.textContent = validation.message;
            errorEl.style.display = 'block';
            return;
        }

        errorEl.style.display = 'none';

        let value;
        switch (type) {
            case 'object':
                value = {};
                break;
            case 'array':
                value = [];
                break;
            case 'boolean':
                value = false;
                break;
            case 'textarea':
            case 'string':
            default:
                value = '';
                break;
        }

        node[key] = value;
        if (!Array.isArray(node)) {
            const order = objectOrders.get(node) || [];
            order.push(key);
            objectOrders.set(node, order);
        }

        const row = buildSection({
            node: value,
            path: [...path, key],
            onChange,
            expandState,
            objectOrders,
            buildSection,
        });

        rowsContainer.appendChild(row);
        resetForm(form);
        onChange?.();
        onCancel?.();
    };

    createBtn.onclick = validateAndCreate;
    cancelBtn.onclick = onCancel;

    form.appendChild(valueContainer);
    return form;
}
