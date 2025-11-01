import { t } from '@i18n/index.js';

export function validateKey(key, node, objectOrders) {
    if (!key) return { valid: false, message: t.errors.emptyKey };

    if (!Array.isArray(node) && typeof node === 'object' && key in node)
        return { valid: false, message: t.errors.duplicateKey };

    return { valid: true };
}
