
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import * as bootstrap from 'bootstrap';
import { createJsonEditor } from './editor/index.js';

const initialData = {
    title: "Epicentr Marketplace",
    description: "JSON-редактор на Vanilla JS + Bootstrap 5 (модульная версия)",
    active: true,
    version: 1,
    meta: {
        author: "Kostya",
        company: "EpicentrM",
        features: {
            collapse: true,
            textareaDetection: true
        }
    },
    about: "Описание объекта"
};

let currentData = structuredClone(initialData);

const container = document.getElementById('json-editor');
const output = document.getElementById('json-output');

const editor = createJsonEditor(container, currentData, (data) => {
    currentData = data;
    output.textContent = JSON.stringify(currentData, null, 2);
});

output.textContent = JSON.stringify(initialData, null, 2);

// --- кнопка для модального просмотра ---
const showBtn = document.createElement('button');
showBtn.className = 'btn btn-primary mt-3';
showBtn.textContent = 'Показать результат';
container.parentElement.appendChild(showBtn);

// создаём модалку один раз
const modalEl = document.createElement('div');
modalEl.className = 'modal fade';
modalEl.tabIndex = -1;
modalEl.innerHTML = `
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Результат JSON</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <pre id="json-preview" class="bg-light p-2 rounded small"></pre>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
      </div>
    </div>
  </div>
`;
document.body.appendChild(modalEl);
const previewEl = modalEl.querySelector('#json-preview');
const modal = new bootstrap.Modal(modalEl);

showBtn.onclick = () => {
    const ordered = editor.getDataOrdered();
    previewEl.textContent = JSON.stringify(ordered, null, 2);
    modal.show();
};
