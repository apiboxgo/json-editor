import { createAddForm } from '@editor/form/index.js';
import { t } from '@i18n/index.js';
import { enableDnd } from '../dnd.js';

export function setupAddForm({ section, node, path, rowsContainer, objectOrders, onChange, buildSection, expandState }) {
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
}
