import * as bootstrap from 'bootstrap';
import { createRow } from './row.js';
import { t } from '../i18n/index.js';

export function createAddForm(
    node,
    path,
    rowsContainer,
    objectOrders,
    onChange,
    onClose,
    buildSection,
    expandState
) {
    const form = document.createElement('div');
    form.className =
        'd-flex flex-column gap-2 mt-2 mb-2 p-2 border rounded bg-white';

    const firstRow = document.createElement('div');
    firstRow.className =
        'd-flex align-items-center flex-wrap gap-2 position-relative';

    const keyInput = document.createElement('input');
    keyInput.className = 'form-control form-control-sm';
    keyInput.placeholder = Array.isArray(node)
        ? 'Index auto-assigned'
        : t.labels.newKey;
    keyInput.style.width = '220px';
    keyInput.autofocus = true;
    setTimeout(() => keyInput.focus(), 0);

    keyInput.oninput = () => {
        keyInput.classList.remove('is-invalid');
        const tooltip = bootstrap.Tooltip.getInstance(keyInput);
        if (tooltip) tooltip.dispose();
    };

    const typeSelect = document.createElement('select');
    typeSelect.className = 'form-select form-select-sm';
    typeSelect.style.width = '140px';
    ['string', 'textarea', 'number', 'boolean', 'object', 'array'].forEach((tType) => {
        const opt = document.createElement('option');
        opt.value = tType;
        opt.textContent = tType;
        typeSelect.appendChild(opt);
    });

    firstRow.append(keyInput, typeSelect);

    const valueContainer = document.createElement('div');
    valueContainer.className = 'w-100';

    const buttonsRow = document.createElement('div');
    buttonsRow.className = 'd-flex align-items-center gap-2';

    const createBtn = document.createElement('button');
    createBtn.className = 'btn btn-sm btn-success';
    createBtn.textContent = t.buttons.create;

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-sm btn-outline-secondary';
    cancelBtn.textContent = t.buttons.cancel;
    cancelBtn.onclick = () => onClose();

    buttonsRow.append(createBtn, cancelBtn);
    form.append(firstRow, valueContainer, buttonsRow);

    const renderValueInput = () => {
        valueContainer.innerHTML = '';
        const type = typeSelect.value;

        if (type === 'textarea') {
            const textarea = document.createElement('textarea');
            textarea.className = 'form-control form-control-sm';
            textarea.rows = 3;
            textarea.placeholder = '...';
            valueContainer.appendChild(textarea);
        } else if (type === 'boolean') {
            const select = document.createElement('select');
            select.className = 'form-select form-select-sm';
            select.innerHTML =
                '<option value="true">true</option><option value="false">false</option>';
            valueContainer.appendChild(select);
        } else if (type === 'number') {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'form-control form-control-sm';
            input.placeholder = '0';
            valueContainer.appendChild(input);
        } else if (type === 'object' || type === 'array') {
            const subData = type === 'object' ? {} : [];
            const subRowsContainer = document.createElement('div');
            subRowsContainer.className = 'mt-2';
            valueContainer.appendChild(subRowsContainer);

            let nestedForm = null;
            const closeOnlyNested = () => {
                if (nestedForm) {
                    nestedForm.remove();
                    nestedForm = null;
                }
            };

            nestedForm = createAddForm(
                subData,
                path,
                subRowsContainer,
                objectOrders,
                onChange,
                closeOnlyNested,
                buildSection,
                expandState
            );
            subRowsContainer.appendChild(nestedForm);
            valueContainer._subData = subData;
        } else {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control form-control-sm';
            input.placeholder = t.labels.value;
            valueContainer.appendChild(input);
        }
    };

    renderValueInput();
    typeSelect.onchange = renderValueInput;

    createBtn.onclick = () => {
        let newKey = Array.isArray(node)
            ? String(node.length)
            : keyInput.value.trim();

        // 🔸 проверка уникальности ключа с тултипом
        if (!Array.isArray(node)) {
            const keyExists = Object.prototype.hasOwnProperty.call(node, newKey);
            if (!newKey || keyExists) {
                const errorText = keyExists
                    ? t.errors.duplicateKey
                    : t.errors.emptyKey;

                keyInput.classList.add('is-invalid');
                keyInput.setAttribute('data-bs-toggle', 'tooltip');
                keyInput.setAttribute('data-bs-placement', 'top');
                keyInput.setAttribute('title', errorText);

                const tooltip =
                    bootstrap.Tooltip.getInstance(keyInput) ||
                    new bootstrap.Tooltip(keyInput);
                tooltip.setContent({ '.tooltip-inner': errorText });
                tooltip.show();
                return;
            } else {
                keyInput.classList.remove('is-invalid');
                keyInput.removeAttribute('data-bs-toggle');
                const tooltip = bootstrap.Tooltip.getInstance(keyInput);
                if (tooltip) tooltip.dispose();
            }
        }

        const type = typeSelect.value;
        let val;

        switch (type) {
            case 'number':
                val = Number(valueContainer.querySelector('input')?.value) || 0;
                break;
            case 'boolean':
                val = valueContainer.querySelector('select')?.value === 'true';
                break;
            case 'textarea':
            case 'string':
                val = valueContainer.querySelector('input, textarea')?.value || '';
                break;
            case 'object':
            case 'array':
                val = valueContainer._subData || (type === 'array' ? [] : {});
                break;
            default:
                val = '';
        }

        if (Array.isArray(node)) {
            node.push(val);
            newKey = String(node.length - 1);
        } else {
            node[newKey] = val;
            const order = objectOrders.get(node) || [];
            if (!order.includes(newKey)) order.push(newKey);
            objectOrders.set(node, order);
        }

        const row = createRow({
            parent: node,
            key: newKey,
            value: val,
            path,
            onChange,
            buildSection,
            expandState,
            objectOrders,
        });

        rowsContainer.appendChild(row);
        onChange();
        onClose();
    };

    return form;
}
