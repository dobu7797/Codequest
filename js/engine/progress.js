// ============================================================
// FORTSCHRITT
// Speichert alles in localStorage – funktioniert komplett offline.
// ============================================================

const STORAGE_KEY = 'codingquest_progress_v1';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function defaultProgress() {
  return {
    levels: {},          // { levelId: { stars, xp, attempts, completedAt } }
    totalXp: 0,
    streak: { count: 0, lastDate: null },
    hintsUsedTotal: 0
  };
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    return { ...defaultProgress(), ...parsed };
  } catch (e) {
    return defaultProgress();
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) { /* Speicher voll o. ä. – App bleibt trotzdem nutzbar */ }
}

function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
  return defaultProgress();
}

// Streak: +1 wenn heute noch nicht gezählt und gestern zuletzt gespielt wurde,
// zurückgesetzt auf 1 wenn eine Lücke entstanden ist.
function bumpStreak(progress) {
  const today = todayStr();
  if (progress.streak.lastDate === today) return progress; // schon heute gezählt
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (progress.streak.lastDate === yesterday) {
    progress.streak.count += 1;
  } else {
    progress.streak.count = 1;
  }
  progress.streak.lastDate = today;
  return progress;
}

function isLevelUnlocked(levelId, flatLevels, progress) {
  const idx = flatLevels.findIndex(l => l.id === levelId);
  if (idx <= 0) return true; // erstes Level immer offen
  const prev = flatLevels[idx - 1];
  return !!progress.levels[prev.id];
}

function completeLevel(progress, levelId, stars, xp) {
  const existing = progress.levels[levelId];
  const bestStars = existing ? Math.max(existing.stars, stars) : stars;
  const wasCompleted = !!existing;
  progress.levels[levelId] = {
    stars: bestStars,
    xp,
    attempts: (existing ? existing.attempts : 0) + 1,
    completedAt: new Date().toISOString()
  };
  if (!wasCompleted) progress.totalXp += xp; // XP nur beim ersten Abschluss zählen
  bumpStreak(progress);
  saveProgress(progress);
  return progress;
}

function getWeltStats(welt, progress) {
  const total = welt.levels.length;
  const done = welt.levels.filter(l => progress.levels[l.id]).length;
  const stars = welt.levels.reduce((s, l) => s + (progress.levels[l.id] ? progress.levels[l.id].stars : 0), 0);
  return { total, done, stars, maxStars: total * 3, percent: total ? Math.round((done / total) * 100) : 0 };
}

function playerLevelFromXp(xp) {
  // grobe Kurve: alle 60 XP ein "Level"
  return Math.floor(xp / 60) + 1;
}
