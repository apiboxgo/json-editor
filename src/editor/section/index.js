import { createControlBar } from './controlBar.js';
import { renderRows } from './rows.js';
import { setupSelection } from './selection.js';
import { setupAddForm } from './addForm.js';
import { enableDnd } from '../dnd.js';
import { sectionWrapperTemplate } from '@templates/sectionTemplates.js';
import { CLASSES } from '@editor/classes.js';

export function buildSection({ node, path, onChange, expandState, objectOrders, buildSection }) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = sectionWrapperTemplate();
    const section = wrapper.firstElementChild;

    section.className = CLASSES.section;

    const { controlBar, selectBtn, deleteBtn, selectedRows } = createControlBar();
    section.appendChild(controlBar);

    const rowsContainer = document.createElement('div');
    rowsContainer.className = CLASSES.rowsContainer;
    section.appendChild(rowsContainer);

    renderRows({ node, path, onChange, expandState, objectOrders, buildSection, rowsContainer });

    enableDnd(rowsContainer, node, () => onChange?.(), objectOrders);

    setupSelection({ selectBtn, deleteBtn, rowsContainer, selectedRows, node, objectOrders, onChange });
    setupAddForm({ section, node, path, rowsContainer, objectOrders, onChange, buildSection, expandState });

    return section;
}
