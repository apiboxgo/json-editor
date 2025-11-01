import { showConfirmModal } from '../modal.js';

export function setupSelection({ selectBtn, deleteBtn, rowsContainer, selectedRows, node, objectOrders, onChange }) {
    let selectionMode = false;

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

    rowsContainer.addEventListener('change', e => {
        if (e.target.classList.contains('json-row-checkbox')) {
            const row = e.target.closest('[data-row="json-row"]');
            if (e.target.checked) selectedRows.add(row);
            else selectedRows.delete(row);
            deleteBtn.disabled = selectedRows.size === 0;
        }
    });

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
}
