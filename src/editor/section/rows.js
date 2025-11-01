import { createRow } from '../row.js';

export function renderRows({ node, path, onChange, expandState, objectOrders, buildSection, rowsContainer }) {
    if (node === null || node === undefined) {
        rowsContainer.appendChild(document.createTextNode('null'));
        return;
    }

    const entries = Array.isArray(node)
        ? node.map((v, i) => [String(i), v])
        : Object.entries(node ?? {});

    if (!Array.isArray(node) && typeof node === 'object' && node) {
        if (!objectOrders.has(node)) objectOrders.set(node, Object.keys(node));
        const order = objectOrders.get(node);
        entries.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
    }

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
}
