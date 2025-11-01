import { createControlBar } from './controlBar.js';
import { renderRows } from './rows.js';
import { setupSelection } from './selection.js';
import { setupAddForm } from './addForm.js';
import { enableDnd } from '../dnd.js';

export function buildSection({ node, path, onChange, expandState, objectOrders, buildSection }) {
    const section = document.createElement('div');
    section.className = 'json-section border rounded p-2 mb-3 bg-light-subtle';

    const { controlBar, selectBtn, deleteBtn, selectedRows } = createControlBar();
    section.appendChild(controlBar);

    const rowsContainer = document.createElement('div');
    rowsContainer.className = 'rows-container';
    section.appendChild(rowsContainer);

    renderRows({ node, path, onChange, expandState, objectOrders, buildSection, rowsContainer });

    enableDnd(rowsContainer, node, () => onChange?.(), objectOrders);

    setupSelection({ selectBtn, deleteBtn, rowsContainer, selectedRows, node, objectOrders, onChange });
    setupAddForm({ section, node, path, rowsContainer, objectOrders, onChange, buildSection, expandState });

    return section;
}
