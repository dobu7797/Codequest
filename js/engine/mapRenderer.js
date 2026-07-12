// ============================================================
// MAP RENDERER
// Zeichnet pro Welt einen "Platinen-Pfad": Knoten (Level) im
// Zickzack, verbunden durch eine glühende SVG-Leiterbahn.
// ============================================================

const ZIGZAG_PATTERN = [0, 42, 68, 42, 0, -42, -68, -42];
function offsetForIndex(i) { return ZIGZAG_PATTERN[i % ZIGZAG_PATTERN.length]; }

const TYPE_ICON = { quiz: '?', fill: '__', code: '</>' };

function nodeStateClass(level, progress, isNext) {
  const done = progress.levels[level.id];
  if (done) return 'done';
  if (isNext) return 'current';
  return 'unlocked';
}

function renderStarsRow(stars) {
  let html = '<div class="stars-row">';
  for (let i = 0; i < 3; i++) html += `<span class="star ${i < stars ? 'on' : ''}"></span>`;
  html += '</div>';
  return html;
}

function renderWeltBlock(welt, flatLevels, progress) {
  const stats = getWeltStats(welt, progress);
  const nextUnlockedId = findNextPlayableLevelId(flatLevels, progress);

  let nodesHtml = '';
  welt.levels.forEach((level, i) => {
    const unlocked = isLevelUnlocked(level.id, flatLevels, progress);
    const done = progress.levels[level.id];
    const isNext = level.id === nextUnlockedId;
    let stateClass = 'locked';
    if (unlocked) stateClass = done ? 'done' : (isNext ? 'current' : 'unlocked');
    const bossClass = level.boss ? 'boss' : '';
    const finalClass = level.final ? 'final' : '';
    const offset = offsetForIndex(i);
    const inner = unlocked
      ? (done
          ? `<div class="type-icon">${level.final ? '🏆' : (level.boss ? '★' : '✓')}</div>${renderStarsRow(done.stars)}`
          : `<div class="num">${i + 1}</div><div class="type-icon">${TYPE_ICON[level.type] || ''}</div>`)
      : `<div class="lock">🔒</div>`;

    nodesHtml += `
      <div class="node-row" data-idx="${i}">
        <button class="level-node ${stateClass} ${bossClass} ${finalClass}"
                style="transform: translateX(${offset}px)"
                data-level-id="${level.id}"
                ${unlocked ? '' : 'disabled aria-disabled="true"'}
                aria-label="${level.title}">
          ${inner}
        </button>
      </div>`;
  });

  return `
    <section class="welt-block" data-welt-id="${welt.id}">
      <div class="welt-header">
        <div class="welt-eyebrow">Board ${welt.nr} / ${WELTEN.length}</div>
        <h2 class="welt-title">${welt.title}</h2>
        <p class="welt-subtitle">${welt.subtitle}</p>
        <div class="welt-progress-row">
          <div class="welt-progress-track"><div class="welt-progress-fill" style="width:${stats.percent}%"></div></div>
          <div class="welt-progress-text">${stats.done}/${stats.total} · ${stats.stars}★</div>
        </div>
      </div>
      <div class="path-container" id="path-${welt.id}">
        <svg class="path-svg"></svg>
        ${nodesHtml}
      </div>
    </section>`;
}

function findNextPlayableLevelId(flatLevels, progress) {
  for (const level of flatLevels) {
    if (!progress.levels[level.id]) {
      return isLevelUnlocked(level.id, flatLevels, progress) ? level.id : null;
    }
  }
  return null; // alles fertig
}

// Zeichnet die glühenden Verbindungslinien zwischen den Knoten-Mittelpunkten
function drawConnections(pathContainerEl) {
  const svg = pathContainerEl.querySelector('.path-svg');
  const nodes = Array.from(pathContainerEl.querySelectorAll('.level-node'));
  if (nodes.length < 2) { svg.innerHTML = ''; return; }

  const containerRect = pathContainerEl.getBoundingClientRect();
  svg.setAttribute('width', containerRect.width);
  svg.setAttribute('height', containerRect.height);
  svg.setAttribute('viewBox', `0 0 ${containerRect.width} ${containerRect.height}`);

  const points = nodes.map(n => {
    const r = n.getBoundingClientRect();
    return {
      x: r.left - containerRect.left + r.width / 2,
      y: r.top - containerRect.top + r.height / 2,
      done: n.classList.contains('done')
    };
  });

  let pathD = `M ${points[0].x} ${points[0].y} `;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midY = (prev.y + curr.y) / 2;
    pathD += `C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y} `;
  }

  const NS = 'http://www.w3.org/2000/svg';
  svg.innerHTML = '';

  const base = document.createElementNS(NS, 'path');
  base.setAttribute('d', pathD);
  base.setAttribute('fill', 'none');
  base.setAttribute('stroke', 'rgba(255,255,255,0.06)');
  base.setAttribute('stroke-width', '4');
  base.setAttribute('stroke-linecap', 'round');
  svg.appendChild(base);

  // Fortschritts-Segment (bis zum letzten "done"-Knoten) glühend einfärben
  let lastDoneIdx = -1;
  points.forEach((p, i) => { if (p.done) lastDoneIdx = i; });
  if (lastDoneIdx > 0) {
    let progD = `M ${points[0].x} ${points[0].y} `;
    for (let i = 1; i <= lastDoneIdx; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midY = (prev.y + curr.y) / 2;
      progD += `C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y} `;
    }
    const glow = document.createElementNS(NS, 'path');
    glow.setAttribute('d', progD);
    glow.setAttribute('fill', 'none');
    glow.setAttribute('stroke', '#5EEAD4');
    glow.setAttribute('stroke-width', '3.5');
    glow.setAttribute('stroke-linecap', 'round');
    glow.setAttribute('opacity', '0.75');
    svg.appendChild(glow);
  }
}

function drawAllConnections() {
  document.querySelectorAll('.path-container').forEach(drawConnections);
}
