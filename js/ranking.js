/*
 * ランキング（この端末に保存する自分たちの記録）
 * ステージごとに上位10件を保存。点数が高い順、同点なら収穫が多い順・先に出した記録が上。
 */
const Ranking = (() => {
  const KEY = 'taberuna.records';
  const NAME_KEY = 'taberuna.name';
  const MAX = 10;
  const DEFAULT_NAME = typeof I18N !== 'undefined' ? I18N.t('defaultName') : '名無しの新入り';

  function loadAll() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
  }
  function saveAll(all) {
    try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* 保存できなくても遊べる */ }
  }

  const compare = (a, b) => b.score - a.score || b.harvest - a.harvest || a.date.localeCompare(b.date);

  function list(stage) {
    return (loadAll()[stage] || []).slice().sort(compare);
  }

  // 記録を追加し、何位に入ったか（圏外なら 0）を返す
  function add(stage, entry) {
    const all = loadAll();
    const rec = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date: new Date().toISOString(), ...entry };
    const sorted = [...(all[stage] || []), rec].sort(compare).slice(0, MAX);
    all[stage] = sorted;
    saveAll(all);
    return { id: rec.id, rank: sorted.findIndex((r) => r.id === rec.id) + 1 };
  }

  function clear(stage) {
    const all = loadAll();
    delete all[stage];
    saveAll(all);
  }

  function getName() {
    try { return localStorage.getItem(NAME_KEY) || ''; } catch { return ''; }
  }
  function setName(name) {
    try { localStorage.setItem(NAME_KEY, name.trim().slice(0, 10)); } catch { /* 保存できなくても遊べる */ }
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }

  return { list, add, clear, getName, setName, formatDate, MAX, DEFAULT_NAME };
})();
