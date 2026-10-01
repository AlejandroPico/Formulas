const INTRO_SORT_VALUE = 'introduced-desc';
// La ordenación por fecha de introducción pertenece únicamente al filtro normal.
document.addEventListener('DOMContentLoaded', () => {
  const select = document.querySelector('#sortSelect');
  if (!select || select.querySelector(`option[value="${INTRO_SORT_VALUE}"]`)) return;
  const option = document.createElement('option');
  option.value = INTRO_SORT_VALUE;
  option.textContent = 'Últimas introducidas';
  select.appendChild(option);
});
