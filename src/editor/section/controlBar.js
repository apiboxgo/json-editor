import { t } from '@i18n/index.js';

export function createControlBar() {
    const controlBar = document.createElement('div');
    controlBar.className = 'd-flex justify-content-end gap-2 mb-2';

    const selectBtn = document.createElement('button');
    selectBtn.className = 'btn btn-sm btn-outline-primary';
    selectBtn.textContent = t.buttons.select || 'Обрати';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-sm btn-outline-danger';
    deleteBtn.textContent = t.buttons.delete;
    deleteBtn.disabled = true;

    const selectedRows = new Set();

    controlBar.append(selectBtn, deleteBtn);
    return { controlBar, selectBtn, deleteBtn, selectedRows };
}
