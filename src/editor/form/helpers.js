export function resetForm(form) {
    form.querySelectorAll('input, select, textarea').forEach(el => el.value = '');
}
