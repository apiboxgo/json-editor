export function enableDnd(rowsContainer, parentNode, onChange, objectOrders) {
    rowsContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragging = rowsContainer.querySelector('.opacity-50');
        if (!dragging) return;
        const after = getDragAfterElement(rowsContainer, e.clientY);
        if (after == null) rowsContainer.appendChild(dragging);
        else rowsContainer.insertBefore(dragging, after);
    });

    rowsContainer.addEventListener('drop', () => {
        if (Array.isArray(parentNode)) {
            const newArray = [];
            const oldArray = parentNode.slice();
            const rows = [...rowsContainer.children];
            rows.forEach(row => {
                const b = row.querySelector('.badge.text-bg-secondary');
                const originalIdx = Number(b.textContent);
                newArray.push(oldArray[originalIdx]);
            });
            parentNode.length = 0;
            newArray.forEach(x => parentNode.push(x));
            [...rowsContainer.children].forEach((row, i) => {
                const b = row.querySelector('.badge.text-bg-secondary');
                if (b) b.textContent = String(i);
            });
        } else if (typeof parentNode === 'object' && parentNode) {
            const order = [];
            [...rowsContainer.children].forEach(child => {
                const keyInput = child.querySelector('input.form-control.form-control-sm');
                if (keyInput && keyInput.value in parentNode) order.push(keyInput.value);
            });
            objectOrders.set(parentNode, order);
        }
        onChange();
    });
}

function getDragAfterElement(container, y) {
    const els = [...container.querySelectorAll('.mb-2.p-2.border.rounded.bg-white:not(.opacity-50)')];
    return els.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) return { offset, element: child };
        return closest;
    }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}
