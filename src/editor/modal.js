import { confirmModalTemplate } from '@templates/modalTemplates.js';
import * as bootstrap from 'bootstrap';

export function showConfirmModal(type, onConfirm) {
    let modalEl = document.getElementById('confirmModal');
    if (!modalEl) {
        document.body.insertAdjacentHTML('beforeend', confirmModalTemplate(t));
        modalEl = document.getElementById('confirmModal');
    }

    const modal = new bootstrap.Modal(modalEl);
    const okBtn = modalEl.querySelector('#confirmModalOk');
    okBtn.onclick = () => {
        onConfirm?.();
        modal.hide();
    };
    modal.show();
}
