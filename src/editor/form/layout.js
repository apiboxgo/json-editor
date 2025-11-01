import { CLASSES } from '@editor/classes.js';

export function buildLayout() {
    const form = document.createElement('div');
    form.className = CLASSES.formWrapper;
    return form;
}
