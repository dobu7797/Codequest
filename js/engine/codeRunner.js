// ============================================================
// CODE RUNNER
// Baut ein iframe-Dokument je nach Level-Modus (html/css/js) und
// stellt nach dem Laden ein "ctx"-Objekt für Vorschau + Validator bereit.
// ============================================================

function escapeForScript(str) {
  return str.replace(/<\/script>/gi, '<\\/script>');
}

function buildDoc(level, code) {
  const html = level.htmlContext || '';
  if (level.mode === 'html') {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:sans-serif;color:#eee;background:#0c1512;padding:16px;margin:0}
      a{color:#5EEAD4}
    </style></head><body>${code}</body></html>`;
  }
  if (level.mode === 'css') {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:sans-serif;color:#eee;background:#0c1512;padding:16px;margin:0}
      ${code}
    </style></head><body>${html}</body></html>`;
  }
  // JS-Modus
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:sans-serif;color:#eee;background:#0c1512;padding:16px;margin:0}
    </style></head><body>${html}
    <script>
      window.__logs = [];
      window.__error = null;
      const __origLog = console.log;
      console.log = function(...args){
        window.__logs.push(args.map(a => {
          try { return typeof a === 'object' ? JSON.stringify(a) : String(a); }
          catch(e){ return String(a); }
        }).join(' '));
        __origLog.apply(console, args);
      };
      try {
        ${escapeForScript(code)}
      } catch (e) {
        window.__error = e.message;
      }
    </script>
    </body></html>`;
}

// Führt den Code in einem (unsichtbaren) iframe aus und liefert das ctx-Objekt
function runInSandbox(level, code) {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    document.body.appendChild(iframe);

    iframe.addEventListener('load', () => {
      const win = iframe.contentWindow;
      const doc = iframe.contentDocument;
      const ctx = {
        doc, win, code,
        logs: (win && win.__logs) || [],
        error: (win && win.__error) || null,
        htmlContext: level.htmlContext || ''
      };
      resolve({ ctx, cleanup: () => iframe.remove() });
    }, { once: true });

    iframe.srcdoc = buildDoc(level, code);
  });
}

// Aktualisiert eine sichtbare Vorschau (iframe) mit dem aktuellen Code
function updatePreview(previewIframeEl, level, code) {
  previewIframeEl.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  previewIframeEl.srcdoc = buildDoc(level, code);
}

// Führt Code aus + validiert, gibt {passed, message} zurück
async function runAndValidate(level, code) {
  if (!level.validatorKey || !VALIDATORS[level.validatorKey]) {
    return { passed: true, message: 'Erledigt!' };
  }
  const { ctx, cleanup } = await runInSandbox(level, code);
  let result;
  try {
    result = VALIDATORS[level.validatorKey](ctx);
  } catch (e) {
    result = { passed: false, message: 'Dein Code hat einen Fehler: ' + e.message };
  }
  cleanup();
  return result;
}
