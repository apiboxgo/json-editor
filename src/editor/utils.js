export const TEXTAREA_FIELDS = ['about', 'description'];
export const TEXTAREA_LENGTH_THRESHOLD = 60;

export function detectType(v) {
    if (Array.isArray(v)) return 'array';
    if (v === null) return 'string';
    const t = typeof v;
    if (['boolean', 'number', 'string', 'object'].includes(t)) return t;
    return 'string';
}

export function parseValue(value, type) {
    switch (type) {
        case 'number': return Number(value);
        case 'boolean': return value === 'true' || value === '1';
        default: return value;
    }
}

export function pathToKey(path) {
    return path.map(p => String(p).replaceAll('.', '\\.')).join('.');
}

export function serializeWithOrder(node, objectOrders) {
    if (Array.isArray(node)) {
        return node.map((v) => serializeWithOrder(v, objectOrders));
    }
    if (node && typeof node === 'object') {
        const orderedKeys = objectOrders.get(node) || Object.keys(node);
        const out = {};
        for (const k of orderedKeys) {
            if (Object.prototype.hasOwnProperty.call(node, k)) {
                out[k] = serializeWithOrder(node[k], objectOrders);
            }
        }
        return out;
    }
    return node;
}
