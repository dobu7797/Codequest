// ============================================================
// VALIDATOREN
// Jede Funktion bekommt ctx = { doc, win, code, logs, error, htmlContext }
// und gibt { passed: boolean, message: string } zurück.
// ============================================================

function px(val) {
  if (!val) return 0;
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

function isNonEmptyColor(val) {
  return val && val !== 'rgba(0, 0, 0, 0)' && val !== 'transparent' && val.trim() !== '';
}

const VALIDATORS = {
  // ---------- HTML ----------
  html_link_basic(ctx) {
    const a = ctx.doc.querySelector('a');
    if (!a) return { passed: false, message: 'Ich finde kein <a>-Element. Erstelle einen Link mit <a href="...">.' };
    const href = (a.getAttribute('href') || '').trim();
    const text = (a.textContent || '').trim();
    if (!href.includes('example.com')) return { passed: false, message: 'Der Link sollte zu "https://example.com" führen.' };
    if (text.toLowerCase() !== 'klick mich') return { passed: false, message: 'Der sichtbare Text sollte genau "Klick mich" sein.' };
    return { passed: true, message: 'Perfekt verlinkt!' };
  },
  html_list_three(ctx) {
    const ul = ctx.doc.querySelector('ul');
    if (!ul) return { passed: false, message: 'Ich finde keine <ul>. Erstelle eine ungeordnete Liste.' };
    const items = Array.from(ul.querySelectorAll('li'));
    if (items.length !== 3) return { passed: false, message: `Ich habe ${items.length} <li>-Einträge gefunden, erwartet werden genau 3.` };
    const texts = items.map(li => li.textContent.trim().toLowerCase());
    const need = ['html', 'css', 'javascript'];
    const ok = need.every(n => texts.some(t => t.includes(n)));
    if (!ok) return { passed: false, message: 'Die Liste sollte HTML, CSS und JavaScript enthalten.' };
    return { passed: true, message: 'Saubere Liste!' };
  },
  html_profile_card(ctx) {
    const h1 = ctx.doc.querySelector('h1');
    const p = ctx.doc.querySelector('p');
    if (!h1 || !h1.textContent.trim()) return { passed: false, message: 'Es fehlt eine <h1> mit Text.' };
    if (!p) return { passed: false, message: 'Es fehlt ein <p>-Absatz.' };
    const words = p.textContent.trim().split(/\s+/).filter(Boolean);
    if (words.length < 5) return { passed: false, message: `Dein Absatz hat nur ${words.length} Wörter, mindestens 5 sind nötig.` };
    return { passed: true, message: 'Klasse Steckbrief!' };
  },

  // ---------- CSS ----------
  css_p_red_24(ctx) {
    const p = ctx.doc.querySelector('p');
    if (!p) return { passed: false, message: 'Kein <p>-Element gefunden.' };
    const cs = ctx.win.getComputedStyle(p);
    const isRed = cs.color === 'rgb(255, 0, 0)';
    const is24 = Math.round(px(cs.fontSize)) === 24;
    if (!isRed) return { passed: false, message: 'Die Textfarbe ist noch nicht rot. Nutze color: red;' };
    if (!is24) return { passed: false, message: `Die Schriftgröße ist ${cs.fontSize}, erwartet werden 24px.` };
    return { passed: true, message: 'Perfekt gestylt!' };
  },
  css_card_box(ctx) {
    const el = ctx.doc.querySelector('.card');
    if (!el) return { passed: false, message: 'Kein Element mit Klasse "card" gefunden.' };
    const cs = ctx.win.getComputedStyle(el);
    if (!isNonEmptyColor(cs.backgroundColor) || cs.backgroundColor === 'rgb(255, 255, 255)') {
      return { passed: false, message: 'Setze eine dunkle background-color, z. B. #222.' };
    }
    if (Math.round(px(cs.paddingTop)) < 15) return { passed: false, message: 'Das padding sollte ca. 20px betragen.' };
    if (Math.round(px(cs.borderTopLeftRadius)) < 5) return { passed: false, message: 'border-radius sollte ca. 10px betragen.' };
    return { passed: true, message: 'Schöne Karte!' };
  },
  css_flex_row(ctx) {
    const el = ctx.doc.querySelector('.row');
    if (!el) return { passed: false, message: 'Kein Element mit Klasse "row" gefunden.' };
    const cs = ctx.win.getComputedStyle(el);
    if (cs.display !== 'flex') return { passed: false, message: 'display sollte "flex" sein.' };
    if (cs.justifyContent !== 'center') return { passed: false, message: 'justify-content sollte "center" sein.' };
    return { passed: true, message: 'Sauber zentriert!' };
  },
  css_button_boss(ctx) {
    const el = ctx.doc.querySelector('.btn');
    if (!el) return { passed: false, message: 'Kein Element mit Klasse "btn" gefunden.' };
    const cs = ctx.win.getComputedStyle(el);
    if (!isNonEmptyColor(cs.backgroundColor) || cs.backgroundColor === 'rgb(255, 255, 255)') {
      return { passed: false, message: 'Der Button braucht eine sichtbare background-color.' };
    }
    if (cs.color !== 'rgb(255, 255, 255)') return { passed: false, message: 'color sollte white sein.' };
    if (Math.round(px(cs.paddingTop)) < 5) return { passed: false, message: 'Füge padding hinzu (mind. 10px).' };
    if (Math.round(px(cs.borderTopLeftRadius)) < 4) return { passed: false, message: 'border-radius sollte mind. 4px sein.' };
    return { passed: true, message: 'Dein Button ist bereit für Klicks!' };
  },

  // ---------- JS Basics ----------
  js_const_log_string(ctx) {
    if (!/const\s+name\s*=/.test(ctx.code)) return { passed: false, message: 'Deklariere "const name = ...".' };
    if (ctx.logs.length === 0) return { passed: false, message: 'Ich sehe keine console.log-Ausgabe.' };
    return { passed: true, message: `Ausgegeben: "${ctx.logs[0]}" – super!` };
  },
  js_math_42(ctx) {
    if (!/const\s+summe\s*=/.test(ctx.code)) return { passed: false, message: 'Deklariere "const summe = ...".' };
    if (!ctx.logs.some(l => l.trim() === '42')) return { passed: false, message: 'Die Ausgabe sollte 42 sein (7 * 6).' };
    return { passed: true, message: '42 – exakt richtig!' };
  },
  js_if_else_volljaehrig(ctx) {
    const out = ctx.logs.join('|').toLowerCase();
    if (!out.includes('volljährig')) return { passed: false, message: 'Bei alter >= 18 sollte "volljährig" ausgegeben werden.' };
    return { passed: true, message: 'Die Bedingung greift richtig!' };
  },
  js_compare_boss(ctx) {
    const out = ctx.logs.join('|').toLowerCase();
    if (!out.includes('a ist größer') && !out.includes('a ist groesser')) {
      return { passed: false, message: 'Da a=10 und b=3, sollte "a ist größer" ausgegeben werden.' };
    }
    return { passed: true, message: 'Vergleichslogik gemeistert!' };
  },

  // ---------- Funktionen & Schleifen ----------
  js_function_double(ctx) {
    if (!/function\s+verdoppeln/.test(ctx.code)) return { passed: false, message: 'Definiere "function verdoppeln(zahl) {...}".' };
    if (!ctx.logs.some(l => l.trim() === '10')) return { passed: false, message: 'verdoppeln(5) sollte 10 ausgeben.' };
    return { passed: true, message: 'Deine Funktion funktioniert!' };
  },
  js_for_loop_1to5(ctx) {
    const nums = ctx.logs.map(l => l.trim());
    const expected = ['1', '2', '3', '4', '5'];
    if (expected.every(n => nums.includes(n)) && nums.length >= 5) {
      return { passed: true, message: 'Schleife läuft wie am Schnürchen!' };
    }
    return { passed: false, message: 'Ich erwarte die Ausgaben 1 bis 5.' };
  },
  js_array_foreach(ctx) {
    if (!/forEach/.test(ctx.code)) return { passed: false, message: 'Nutze .forEach auf deinem Array.' };
    const out = ctx.logs.join('|').toLowerCase();
    if (!out.includes('rot') || !out.includes('grün') && !out.includes('gruen') || !out.includes('blau')) {
      return { passed: false, message: 'Es sollten rot, grün und blau ausgegeben werden.' };
    }
    return { passed: true, message: 'forEach sitzt!' };
  },
  js_even_filter_boss(ctx) {
    const nums = ctx.logs.map(l => l.trim());
    const expected = ['2', '4', '6'];
    const hasOdd = nums.some(n => ['1', '3', '5'].includes(n));
    if (hasOdd) return { passed: false, message: 'Es sollten nur GERADE Zahlen ausgegeben werden.' };
    if (!expected.every(n => nums.includes(n))) return { passed: false, message: 'Erwartet werden 2, 4 und 6.' };
    return { passed: true, message: 'Sauber gefiltert!' };
  },

  // ---------- DOM ----------
  js_dom_settext(ctx) {
    const el = ctx.doc.querySelector('.titel');
    if (!el || el.textContent.trim() !== 'Verändert!') {
      return { passed: false, message: 'Der Text von ".titel" sollte "Verändert!" sein.' };
    }
    return { passed: true, message: 'Text erfolgreich geändert!' };
  },
  js_dom_addclass(ctx) {
    const el = ctx.doc.querySelector('.box');
    if (!el || !el.classList.contains('aktiv')) {
      return { passed: false, message: 'Die Box sollte die Klasse "aktiv" bekommen.' };
    }
    return { passed: true, message: 'Klasse hinzugefügt!' };
  },
  js_dom_click_reaction(ctx) {
    const btn = ctx.doc.querySelector('.go');
    const out = ctx.doc.querySelector('.out');
    if (!btn || !out) return { passed: false, message: 'Button ".go" oder Ausgabe ".out" fehlt im HTML.' };
    btn.click();
    if (out.textContent.trim() !== 'Geklickt!') {
      return { passed: false, message: 'Nach dem Klick sollte ".out" den Text "Geklickt!" zeigen.' };
    }
    return { passed: true, message: 'Klick-Reaktion funktioniert!' };
  },
  js_dom_counter_boss(ctx) {
    const btn = ctx.doc.querySelector('.plus');
    const count = ctx.doc.querySelector('.count');
    if (!btn || !count) return { passed: false, message: 'Button ".plus" oder Anzeige ".count" fehlt.' };
    btn.click(); btn.click(); btn.click();
    const val = count.textContent.trim();
    if (val !== '3') return { passed: false, message: `Nach 3 Klicks steht dort "${val}", erwartet wird "3".` };
    return { passed: true, message: 'Zähler funktioniert einwandfrei!' };
  },

  // ---------- Boss-Projekte ----------
  js_todo_add_boss(ctx) {
    const btn = ctx.doc.querySelector('.add');
    const list = ctx.doc.querySelector('.list');
    if (!btn || !list) return { passed: false, message: 'Button ".add" oder Liste ".list" fehlt.' };
    btn.click();
    const items = list.querySelectorAll('li');
    if (items.length === 0) return { passed: false, message: 'Es wurde kein <li> hinzugefügt.' };
    return { passed: true, message: 'To-Do erfolgreich hinzugefügt!' };
  },
  js_color_changer_boss(ctx) {
    const btn = ctx.doc.querySelector('.farbe');
    const flaeche = ctx.doc.querySelector('.flaeche');
    if (!btn || !flaeche) return { passed: false, message: 'Button ".farbe" oder ".flaeche" fehlt.' };
    const before = ctx.win.getComputedStyle(flaeche).backgroundColor;
    btn.click();
    const after = ctx.win.getComputedStyle(flaeche).backgroundColor;
    if (after === before) return { passed: false, message: 'Die Hintergrundfarbe hat sich nach dem Klick nicht geändert.' };
    return { passed: true, message: 'Farbwechsel funktioniert!' };
  },
  js_quiz_card_boss(ctx) {
    const input = ctx.doc.querySelector('.answer');
    const btn = ctx.doc.querySelector('.check');
    const result = ctx.doc.querySelector('.result');
    if (!input || !btn || !result) return { passed: false, message: 'Es fehlt ein Element (.answer, .check oder .result).' };
    input.value = 'Paris';
    btn.click();
    if (result.textContent.trim() !== 'Richtig!') return { passed: false, message: 'Bei "Paris" sollte ".result" den Text "Richtig!" zeigen.' };
    input.value = 'Berlin';
    btn.click();
    if (result.textContent.trim() !== 'Nochmal!') return { passed: false, message: 'Bei einer falschen Antwort sollte "Nochmal!" erscheinen.' };
    return { passed: true, message: 'Deine Quiz-Karte funktioniert perfekt!' };
  },
  js_final_boss(ctx) {
    const btn = ctx.doc.querySelector('.start');
    const ziel = ctx.doc.querySelector('.ziel');
    if (!btn || !ziel) return { passed: false, message: 'Button ".start" oder Ziel ".ziel" fehlt.' };
    const beforeText = ziel.textContent.trim();
    btn.click();
    const afterText = ziel.textContent.trim();
    if (afterText === beforeText) return { passed: false, message: 'Der Text von ".ziel" sollte sich nach dem Klick ändern.' };
    if (!ziel.classList.contains('aktiv')) return { passed: false, message: '".ziel" sollte die Klasse "aktiv" bekommen.' };
    return { passed: true, message: 'Herzlichen Glückwunsch – du hast den finalen Boss besiegt! 🏆' };
  }
};
