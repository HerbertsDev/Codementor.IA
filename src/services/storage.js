const KEY = 'codementor-progress-v1';
const emptyState = () => ({ completed: [], drafts: {}, hints: {}, theme: 'dark' });

export function loadProgress() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!data || typeof data !== 'object') return emptyState();
    return {
      completed: Array.isArray(data.completed) ? data.completed.filter(x => typeof x === 'string') : [],
      drafts: data.drafts && typeof data.drafts === 'object' ? data.drafts : {},
      hints: data.hints && typeof data.hints === 'object' ? data.hints : {},
      theme: data.theme === 'light' ? 'light' : 'dark'
    };
  } catch { return emptyState(); }
}
export function saveProgress(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* Navegador pode bloquear armazenamento. */ }
}
export function resetProgress() {
  const state = emptyState();
  saveProgress(state);
  return state;
}
