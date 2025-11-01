import * as bootstrap from 'bootstrap';
import { t } from '../i18n/index.js';

let modalEl = null;
let modalInstance = null;

export function showConfirmModal(type = 'single', onConfirm, opts = {}) {
    if (!modalEl) {
        modalEl = document.createElement('div');
        modalEl.className = 'modal fade';
        modalEl.tabIndex = -1;
        modalEl.innerHTML = `
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">${t.modal.confirmDelete}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body" id="confirm-modal-body"></div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t.buttons.cancel}</button>
                <button type="button" class="btn btn-danger" id="confirm-delete-btn">${t.buttons.delete}</button>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(modalEl);
        modalInstance = new bootstrap.Modal(modalEl);
    }

    const body = modalEl.querySelector('#confirm-modal-body');
    const confirmBtn = modalEl.querySelector('#confirm-delete-btn');

    if (type === 'multiple') {
        const count = opts.count || 0;
        body.textContent = `${t.modal.deleteText} (${count} ${count === 1 ? 'елемент' : 'елементи'})`;
    } else {
        body.textContent = t.modal.deleteText;
    }

    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.replaceWith(newBtn);

    newBtn.addEventListener('click', () => {
        onConfirm?.();
        modalInstance.hide();
    });

    modalInstance.show();
}
