import { detectType, parseValue, pathToKey, TEXTAREA_FIELDS, TEXTAREA_LENGTH_THRESHOLD } from './utils.js';
import { showConfirmModal } from './modal.js';

export function createRow({ parent, key, value, path, onChange, buildSection, expandState, objectOrders }) {
    const row = document.createElement('div');
    row.className = 'mb-2 p-2 border rounded bg-white';
    row.draggable = true;
    row.dataset.row = 'json-row';

    row.addEventListener('dragstart', () => {
        row.classList.add('opacity-50');
    });
    row.addEventListener('dragend', () => {
        row.classList.remove('opacity-50');
    });

    const line = document.createElement('div');
    line.className = 'd-flex align-items-start gap-2 flex-wrap';

    // чекбокс мультивыбора
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input json-row-checkbox';
    checkbox.style.display = 'none';
    line.appendChild(checkbox);

    const dragHandle = document.createElement('span');
    dragHandle.className = 'badge text-bg-light user-select-none';
    dragHandle.textContent = '↕';
    dragHandle.style.cursor = 'grab';

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn btn-sm btn-link p-0 text-decoration-none';
    const isNested = typeof value === 'object' && value !== null;
    toggleBtn.style.visibility = isNested ? 'visible' : 'hidden';
    toggleBtn.textContent = '▶️';

    let keyControl;
    if (Array.isArray(parent)) {
        keyControl = document.createElement('span');
        keyControl.className = 'badge text-bg-secondary';
        keyControl.textContent = String(key);
    } else {
        keyControl = document.createElement('input');
        keyControl.className = 'form-control form-control-sm';
        keyControl.style.width = '220px';
        keyControl.value = String(key);
        keyControl.addEventListener('change', () => {
            const newKey = keyControl.value.trim();
            if (!newKey || newKey === key) return;
            parent[newKey] = parent[key];
            delete parent[key];
            const order = objectOrders.get(parent) || [];
            const idx = order.indexOf(key);
            if (idx !== -1) order[idx] = newKey;
            objectOrders.set(parent, order);
            onChange();
        });
    }

    const valueContainer = document.createElement('div');
    valueContainer.className = 'flex-grow-1';

    if (isNested) {
        const nestedPath = [...path, key];
        const nestedKey = pathToKey(nestedPath);
        const nested = buildSection({
            node: value,
            path: nestedPath,
            onChange,
            expandState,
            objectOrders,
            buildSection
        });

        nested.classList.add('collapse');

        if (expandState.get(nestedKey)) {
            nested.classList.add('show');
            toggleBtn.textContent = '🔽';
        }

        toggleBtn.onclick = () => {
            const isShown = nested.classList.contains('show');
            nested.classList.toggle('show');
            toggleBtn.textContent = isShown ? '▶️' : '🔽';
            expandState.set(nestedKey, !isShown);
        };

        valueContainer.appendChild(nested);
    } else {
        const detected = detectType(value);
        const input = makeValueInput(String(key), value, detected);
        valueContainer.appendChild(input);
        input.addEventListener('input', () => {
            parent[key] = parseValue(input.value, detected);
            onChange();
        });
    }

    // ✅ создаём кнопку удаления ДО использования
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-sm btn-outline-danger';
    deleteBtn.textContent = '🗑️';
    deleteBtn.onclick = () =>
        showConfirmModal('single', () => {
            if (Array.isArray(parent)) parent.splice(Number(key), 1);
            else {
                const order = objectOrders.get(parent) || [];
                const idx = order.indexOf(key);
                if (idx !== -1) order.splice(idx, 1);
                delete parent[key];
            }
            row.remove();
            onChange();
        });

    line.append(dragHandle, toggleBtn, keyControl, valueContainer, deleteBtn);
    row.appendChild(line);
    return row;
}

function makeValueInput(key, value, type) {
    const isTextarea =
        type === 'string' &&
        (TEXTAREA_FIELDS.includes(key) ||
            (typeof value === 'string' && value.length > TEXTAREA_LENGTH_THRESHOLD));

    if (type === 'boolean') {
        const sel = document.createElement('select');
        sel.className = 'form-select form-select-sm';
        sel.innerHTML = `<option value="true">true</option><option value="false">false</option>`;
        sel.value = value ? 'true' : 'false';
        return sel;
    }

    if (type === 'number') {
        const inp = document.createElement('input');
        inp.type = 'number';
        inp.className = 'form-control form-control-sm';
        inp.value = value ?? 0;
        return inp;
    }

    if (isTextarea) {
        const ta = document.createElement('textarea');
        ta.className = 'form-control form-control-sm';
        ta.rows = 2;
        ta.value = value ?? '';
        return ta;
    }

    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'form-control form-control-sm';
    inp.value = value ?? '';
    return inp;
}
