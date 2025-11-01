import { buildSection } from './section/index.js';
import { serializeWithOrder } from './utils.js';

export function createJsonEditor(container, data, onChange) {
    const expandState = new Map();
    const objectOrders = new WeakMap();

    container.innerHTML = '';
    const rootSection = buildSection({
        node: data,
        path: [],
        onChange: () => onChange?.(data),
        expandState,
        objectOrders,
        buildSection: (params) => buildSection({ ...params, onChange: () => onChange?.(data) })
    });

    container.appendChild(rootSection);
    return {
        getDataOrdered() {
            return serializeWithOrder(data, objectOrders);
        }
    };
}
