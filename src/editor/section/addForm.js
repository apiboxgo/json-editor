import { createAddForm } from '@editor/form/index.js';
import { t } from '@i18n/index.js';
import { enableDnd } from '../dnd.js';
import { CLASSES } from '@editor/classes.js';
import { ICONS } from '@templates/iconsTemplate.js';

export function setupAddForm({ section, node, path, rowsContainer, objectOrders, onChange, buildSection, expandState }) {
    const addArea = document.createElement('div');
    addArea.className = CLASSES.addArea;

    const addToggle = document.createElement('button');
    addToggle.className = CLASSES.btnSuccess;
    addToggle.innerHTML = `${ICONS.plus} ${t.buttons.add}`;
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
