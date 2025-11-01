import { CLASSES } from '@editor/classes.js';

export function selectOptions() {
    return `<option value="true">true</option><option value="false">false</option>`;
}

export function sectionWrapperTemplate() {
    return `
    <div class="${CLASSES.section}">
      <div class="${CLASSES.controlBar}"></div>
      <div class="${CLASSES.rowsContainer}"></div>
      <div class="${CLASSES.addArea}"></div>
    </div>
  `;
}
