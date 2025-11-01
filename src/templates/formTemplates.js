import { CLASSES } from '@editor/classes.js';

export function formTemplate(t) {
    return `
    <div class="${CLASSES.formWrapper}">
      <div class="mb-2">
        <input type="text" class="${CLASSES.formInput}" placeholder="${t.labels.newKey}">
      </div>
      <div class="mb-2">
        <select class="${CLASSES.formSelect}">
          <option value="string">string</option>
          <option value="number">number</option>
          <option value="boolean">boolean</option>
          <option value="array">array</option>
          <option value="object">object</option>
          <option value="textarea">textarea</option>
        </select>
      </div>
      <div class="value-container mt-2"></div>
      <div class="d-flex gap-2 mt-2">
        <button class="${CLASSES.btnCreate}">${t.buttons.create}</button>
        <button class="${CLASSES.btnCancel}">${t.buttons.cancel}</button>
      </div>
      <div class="${CLASSES.errorMessage}" style="display:none;"></div>
    </div>
  `;
}
