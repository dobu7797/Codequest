// ============================================================
// APP.JS — Steuerung, Routing, Level-Interaktionen
// ============================================================

let progress = loadProgress();
const flatLevels = getAllLevelsFlat();

const root = document.getElementById('app-root');

// -------- Routing (Hash-basiert: #/map oder #/level/<id>) --------
function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, '');
  if (hash.startsWith('level/')) return { view: 'level', id: hash.slice(6) };
  return { view: 'map' };
}

function navigate(hash) {
  location.hash = hash;
}

window.addEventListener('hashchange', render);
window.addEventListener('resize', debounce(drawAllConnections, 150));

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// -------- Header --------
function renderHeader() {
  const playerLvl = playerLevelFromXp(progress.totalXp);
  const xpIntoLevel = progress.totalXp % 60;
  const pct = Math.round((xpIntoLevel / 60) * 100);
  document.getElementById('header-stats').innerHTML = `
    <div class="stat-chip"><span>⚡</span><span class="val">${progress.totalXp}</span></div>
    <div class="stat-chip streak"><span>🔥</span><span class="val">${progress.streak.count}</span></div>
  `;
  document.getElementById('xp-bar-fill').style.width = pct + '%';
  document.getElementById('xp-bar-label').textContent = `Level ${playerLvl} · ${xpIntoLevel}/60 XP bis Level ${playerLvl + 1}`;
}

// -------- Map View --------
function renderMapView() {
  const doneCount = Object.keys(progress.levels).length;
  const heroHtml = doneCount === 0 ? `
    <div class="welcome-hero">
      <h1>&lt;CodeQuest/&gt;</h1>
      <p>Folge der Leiterbahn. Jedes Board schaltet neue Fähigkeiten frei.</p>
    </div>` : '';

  const weltHtml = WELTEN.map(w => renderWeltBlock(w, flatLevels, progress)).join('');

  root.innerHTML = `<div class="map-scroll">${heroHtml}${weltHtml}</div>`;

  root.querySelectorAll('.level-node').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      navigate('/level/' + btn.dataset.levelId);
    });
  });

  requestAnimationFrame(drawAllConnections);
}

// -------- Level View --------
let sessionState = {}; // { attempts, hintUsed }

function renderLevelView(levelId) {
  const found = findLevelById(levelId);
  if (!found) { navigate('/map'); return; }
  const { level, welt } = found;
  sessionState = { attempts: 0, hintUsed: false };

  const topbar = `
    <div class="level-topbar">
      <button class="btn-back" id="btn-back">← Karte</button>
      <span class="welt-tag">${welt.title}</span>
    </div>`;

  let bodyHtml = '';
  if (level.type === 'quiz') bodyHtml = renderQuizBody(level);
  else if (level.type === 'fill') bodyHtml = renderFillBody(level);
  else if (level.type === 'code') bodyHtml = renderCodeBody(level);

  root.innerHTML = `
    <div class="level-view">
      ${topbar}
      <div class="level-card">
        <h1 class="level-title">${level.title}</h1>
        <p class="level-intro">${level.intro}</p>
        ${bodyHtml}
      </div>
    </div>`;

  document.getElementById('btn-back').addEventListener('click', () => navigate('/map'));
  wireLevelInteractions(level);
}

function renderQuizBody(level) {
  const choicesHtml = level.choices.map((c, i) => `
    <button class="quiz-choice" data-idx="${i}">${c}</button>
  `).join('');
  return `
    <div class="quiz-choices" id="quiz-choices">
      <p style="font-weight:700; margin: 10px 0 2px;">${level.question}</p>
      ${choicesHtml}
    </div>
    <div class="feedback-box" id="feedback"></div>
    <div class="action-row">
      <button class="btn btn-primary" id="btn-continue" disabled>Weiter</button>
    </div>`;
}

function renderFillBody(level) {
  const parts = level.codeTemplate.split('___');
  let html = '<div class="fill-text">';
  parts.forEach((part, i) => {
    html += escapeHtml(part);
    if (i < parts.length - 1) {
      html += `<input class="fill-input" data-blank="${i}" autocomplete="off" spellcheck="false" />`;
    }
  });
  html += '</div>';
  return `
    <div class="code-panel">${html}</div>
    <button class="btn btn-secondary" id="btn-hint" style="margin-top:12px;">💡 Hinweis</button>
    <p class="hint-text" id="hint-text">${level.hint || ''}</p>
    <div class="feedback-box" id="feedback"></div>
    <div class="action-row">
      <button class="btn btn-primary" id="btn-check">Prüfen</button>
      <button class="btn btn-primary" id="btn-continue" style="display:none;">Weiter</button>
    </div>`;
}

function renderCodeBody(level) {
  const lines = (level.starter || '').split('\n').length;
  const gutter = Array.from({ length: Math.max(lines, 6) }, (_, i) => i + 1).join('\n');
  return `
    <div class="level-goal"><b>Aufgabe:</b> ${level.goalDescription}</div>
    <div class="code-panel">
      <div class="code-editor-wrap">
        <div class="code-gutter" id="code-gutter">${gutter}</div>
        <textarea class="code-textarea" id="code-input" spellcheck="false" autocapitalize="off" autocorrect="off">${escapeHtml(level.starter || '')}</textarea>
      </div>
      <div class="preview-label">Vorschau</div>
      <div class="preview-frame-wrap">
        <iframe class="preview-frame" id="preview-frame" title="Vorschau"></iframe>
      </div>
    </div>
    <button class="btn btn-secondary" id="btn-hint" style="margin-top:12px;">💡 Hinweis</button>
    <p class="hint-text" id="hint-text">${level.hint || 'Lies die Aufgabe genau: Welche Tags/Eigenschaften/Befehle brauchst du?'}</p>
    <div class="feedback-box" id="feedback"></div>
    <div class="action-row">
      <button class="btn btn-primary" id="btn-run">▶ Code ausführen & prüfen</button>
      <button class="btn btn-primary" id="btn-continue" style="display:none;">Weiter</button>
    </div>`;
}

function escapeHtml(s) {
  return (s || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

function wireLevelInteractions(level) {
  if (level.type === 'quiz') wireQuiz(level);
  else if (level.type === 'fill') wireFill(level);
  else if (level.type === 'code') wireCode(level);
}

function wireQuiz(level) {
  const buttons = Array.from(document.querySelectorAll('.quiz-choice'));
  const feedback = document.getElementById('feedback');
  const continueBtn = document.getElementById('btn-continue');
  let answered = false;
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      sessionState.attempts++;
      const idx = parseInt(btn.dataset.idx, 10);
      buttons.forEach(b => b.disabled = true);
      if (idx === level.correctIndex) {
        btn.classList.add('correct');
        feedback.className = 'feedback-box show ok';
        feedback.textContent = '✓ Richtig! ' + (level.explanation || '');
      } else {
        btn.classList.add('wrong');
        buttons[level.correctIndex].classList.add('correct');
        feedback.className = 'feedback-box show err';
        feedback.textContent = '✗ Nicht ganz. ' + (level.explanation || '');
      }
      continueBtn.disabled = false;
    });
  });
  continueBtn.addEventListener('click', () => {
    const stars = sessionState.attempts <= 1 ? 3 : 2;
    finishLevel(level, stars);
  });
}

function wireFill(level) {
  const inputs = Array.from(document.querySelectorAll('.fill-input'));
  const feedback = document.getElementById('feedback');
  const checkBtn = document.getElementById('btn-check');
  const continueBtn = document.getElementById('btn-continue');
  const hintBtn = document.getElementById('btn-hint');
  hintBtn.addEventListener('click', () => {
    sessionState.hintUsed = true;
    document.getElementById('hint-text').classList.add('show');
  });
  checkBtn.addEventListener('click', () => {
    sessionState.attempts++;
    const ok = inputs.every((inp, i) => {
      const expected = (level.blanks[i] || '').trim().toLowerCase();
      return inp.value.trim().toLowerCase() === expected;
    });
    if (ok) {
      feedback.className = 'feedback-box show ok';
      feedback.textContent = '✓ Genau richtig!';
      checkBtn.style.display = 'none';
      continueBtn.style.display = 'inline-block';
    } else {
      feedback.className = 'feedback-box show err';
      feedback.textContent = '✗ Noch nicht ganz richtig. Versuch es nochmal!';
    }
  });
  continueBtn.addEventListener('click', () => {
    let stars = 3;
    if (sessionState.hintUsed) stars = Math.min(stars, 2);
    if (sessionState.attempts > 2) stars = Math.min(stars, 1);
    finishLevel(level, stars);
  });
}

function wireCode(level) {
  const textarea = document.getElementById('code-input');
  const gutter = document.getElementById('code-gutter');
  const previewFrame = document.getElementById('preview-frame');
  const runBtn = document.getElementById('btn-run');
  const continueBtn = document.getElementById('btn-continue');
  const feedback = document.getElementById('feedback');
  const hintBtn = document.getElementById('btn-hint');

  hintBtn.addEventListener('click', () => {
    sessionState.hintUsed = true;
    document.getElementById('hint-text').classList.add('show');
  });

  function syncGutter() {
    const n = textarea.value.split('\n').length;
    gutter.textContent = Array.from({ length: Math.max(n, 6) }, (_, i) => i + 1).join('\n');
  }

  function refreshPreview() {
    updatePreview(previewFrame, level, textarea.value);
  }

  textarea.addEventListener('input', debounce(() => { syncGutter(); refreshPreview(); }, 300));
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart, end = textarea.selectionEnd;
      textarea.value = textarea.value.slice(0, start) + '  ' + textarea.value.slice(end);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
    }
  });

  syncGutter();
  refreshPreview();

  runBtn.addEventListener('click', async () => {
    sessionState.attempts++;
    runBtn.disabled = true;
    runBtn.textContent = '⏳ Prüfe...';
    const result = await runAndValidate(level, textarea.value);
    refreshPreview();
    runBtn.disabled = false;
    runBtn.textContent = '▶ Code ausführen & prüfen';
    feedback.className = 'feedback-box show ' + (result.passed ? 'ok' : 'err');
    feedback.textContent = (result.passed ? '✓ ' : '✗ ') + result.message;
    if (result.passed) {
      runBtn.style.display = 'none';
      continueBtn.style.display = 'inline-block';
    }
  });

  continueBtn.addEventListener('click', () => {
    let stars = 3;
    if (sessionState.hintUsed) stars = Math.min(stars, 2);
    if (sessionState.attempts > 2) stars = Math.min(stars, 1);
    finishLevel(level, stars);
  });
}

function finishLevel(level, stars) {
  const wasAlreadyDone = !!progress.levels[level.id];
  progress = completeLevel(progress, level.id, stars, level.xp);
  showCompletionOverlay(level, stars, wasAlreadyDone);
}

function showCompletionOverlay(level, stars, wasAlreadyDone) {
  const overlay = document.createElement('div');
  overlay.className = 'complete-overlay';
  overlay.innerHTML = `
    <div class="complete-card">
      <div class="big-emoji">${level.final ? '🏆' : (stars === 3 ? '⚡' : '✅')}</div>
      <h2>${level.final ? 'App gemeistert!' : 'Level geschafft!'}</h2>
      <div class="stars-big">
        ${[0, 1, 2].map(i => `<span class="s ${i < stars ? 'on' : ''}">★</span>`).join('')}
      </div>
      <div class="xp-earned">${wasAlreadyDone ? 'Wiederholt' : '+' + level.xp + ' XP'}</div>
      <button class="btn btn-primary" id="btn-map-return" style="width:100%;">Weiter zur Karte</button>
    </div>`;
  document.body.appendChild(overlay);
  document.getElementById('btn-map-return').addEventListener('click', () => {
    overlay.remove();
    navigate('/map');
  });
}

// -------- Render Dispatcher --------
function render() {
  renderHeader();
  const route = currentRoute();
  if (route.view === 'level') renderLevelView(route.id);
  else renderMapView();
}

render();

// -------- Service Worker --------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}
