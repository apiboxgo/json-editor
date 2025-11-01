import { createRow } from './row.js';
import { enableDnd } from './dnd.js';
import { createAddForm } from './form.js';
import { showConfirmModal } from './modal.js';
import { t } from '../i18n/index.js';

export function buildSection({ node, path, onChange, expandState, objectOrders, buildSection }) {
    const section = document.createElement('div');
    section.className = 'json-section border rounded p-2 mb-3 bg-light-subtle';

    // 🔹 Панель управления выбором
    const controlBar = document.createElement('div');
    controlBar.className = 'd-flex justify-content-end gap-2 mb-2';

    const selectBtn = document.createElement('button');
    selectBtn.className = 'btn btn-sm btn-outline-primary';
    selectBtn.textContent = 'Обрати';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-sm btn-outline-danger';
    deleteBtn.textContent = 'Видалити';
    deleteBtn.disabled = true;

    controlBar.append(selectBtn, deleteBtn);
   // section.appendChild(controlBar);

    const rowsContainer = document.createElement('div');
    rowsContainer.className = 'rows-container';
    section.appendChild(rowsContainer);

    if (node === null || node === undefined)
        return document.createTextNode('null');

    const entries = Array.isArray(node)
        ? node.map((v, i) => [String(i), v])
        : Object.entries(node ?? {});

    // сортировка по порядку ключей
    if (!Array.isArray(node) && typeof node === 'object' && node) {
        if (!objectOrders.has(node)) objectOrders.set(node, Object.keys(node));
        const order = objectOrders.get(node);
        entries.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
    }

    // создаём строки без дублирующих чекбоксов
    entries.forEach(([key, value]) => {
        const row = createRow({
            parent: node,
            key,
            value,
            path,
            onChange,
            buildSection,
            expandState,
            objectOrders,
        });
        rowsContainer.appendChild(row);
    });

    enableDnd(rowsContainer, node, () => onChange?.(), objectOrders);

    // --- 🔹 Логика мультивыбора ---
    let selectionMode = false;
    let selectedRows = new Set();

    selectBtn.onclick = () => {
        selectionMode = !selectionMode;
        selectBtn.textContent = selectionMode ? 'Скасувати' : 'Обрати';

        rowsContainer.querySelectorAll('.json-row-checkbox').forEach(cb => {
            cb.style.display = selectionMode ? 'inline-block' : 'none';
            cb.checked = false;
        });

        selectedRows.clear();
        deleteBtn.disabled = true;
    };

    rowsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('json-row-checkbox')) {
            const row = e.target.closest('[data-row="json-row"]');
            if (e.target.checked) selectedRows.add(row);
            else selectedRows.delete(row);
            deleteBtn.disabled = selectedRows.size === 0;
        }
    });

    // 🔹 Массовое удаление с модалкой Bootstrap
    deleteBtn.onclick = () => {
        if (selectedRows.size === 0) return;

        showConfirmModal('multiple', () => {
            selectedRows.forEach(row => {
                const keyInput = row.querySelector('input.form-control.form-control-sm');
                const badge = row.querySelector('.badge.text-bg-secondary');
                const key = keyInput ? keyInput.value : badge?.textContent;

                if (Array.isArray(node)) {
                    node.splice(Number(key), 1);
                } else if (typeof node === 'object' && key in node) {
                    delete node[key];
                    const order = objectOrders.get(node) || [];
                    const idx = order.indexOf(key);
                    if (idx !== -1) order.splice(idx, 1);
                    objectOrders.set(node, order);
                }
                row.remove();
            });

            selectedRows.clear();
            deleteBtn.disabled = true;
            onChange?.();
        }, { count: selectedRows.size });
    };

    // 🔹 Кнопка добавления нового поля
    const addArea = document.createElement('div');
    addArea.className = 'mt-2';

    const addToggle = document.createElement('button');
    addToggle.className = 'btn btn-sm btn-outline-success d-flex align-items-center gap-1';
    addToggle.innerHTML = `<i class="bi bi-plus-lg"></i> ${t.buttons.add}`;
    addArea.appendChild(addToggle);

    let addForm = null;
    addToggle.onclick = () => {
        if (addForm) return;

        addForm = createAddForm(
            node,
            path,
            rowsContainer,
            objectOrders,
            () => {
                onChange?.();
                enableDnd(rowsContainer, node, () => onChange?.(), objectOrders);
            },
            () => {
                addForm.remove();
                addForm = null;
            },
            buildSection,
            expandState
        );

        addArea.insertBefore(addForm, addToggle);
    };

    section.appendChild(addArea);
    return section;
}
