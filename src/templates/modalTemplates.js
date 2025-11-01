export function confirmModalTemplate(t) {
    return `
    <div class="modal fade" tabindex="-1" id="confirmModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${t.modal.confirmDelete}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>${t.modal.deleteText}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t.buttons.cancel}</button>
            <button type="button" class="btn btn-danger" id="confirmModalOk">${t.buttons.delete}</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
