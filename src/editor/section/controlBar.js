import { t } from '@i18n/index.js';
import { CLASSES } from '@editor/classes.js';

export function createControlBar() {
    const controlBar = document.createElement('div');
    controlBar.className = CLASSES.controlBar;

    const selectBtn = document.createElement('button');
    selectBtn.className = CLASSES.btnPrimary;
    selectBtn.textContent = t.buttons.select || 'Обрати';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = CLASSES.btnDanger;
    deleteBtn.textContent = t.buttons.delete;
    deleteBtn.disabled = true;

    const selectedRows = new Set();

    controlBar.append(selectBtn, deleteBtn);
    return { controlBar, selectBtn, deleteBtn, selectedRows };
}
