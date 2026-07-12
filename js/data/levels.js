// ============================================================
// LEVEL- UND WELTENDATEN
// Jede "Welt" ist ein Kapitel. Jedes Level hat einen type:
//   'quiz'  -> Multiple Choice
//   'fill'  -> Lückentext (Antwort eintippen)
//   'code'  -> freier Code-Editor mit Live-Vorschau + Validator
// ============================================================

const WELTEN = [
  {
    id: 'w1',
    nr: 1,
    title: 'HTML-Fundament',
    subtitle: 'Die Bausteine des Web',
    icon: 'html',
    levels: [
      {
        id: 'w1-l1', type: 'quiz', title: 'Das erste Tag', xp: 10,
        intro: 'HTML besteht aus "Tags" – Markierungen, die dem Browser sagen, was etwas ist.',
        question: 'Welches Tag erzeugt die größte Überschrift?',
        choices: ['<h1>', '<h6>', '<p>', '<big>'],
        correctIndex: 0,
        explanation: '<h1> ist die größte von sechs Überschriftenstufen (h1–h6).'
      },
      {
        id: 'w1-l2', type: 'fill', title: 'Absatz schreiben', xp: 10,
        intro: 'Text in einem eigenen Absatz steht zwischen einem Start- und einem End-Tag.',
        mode: 'html',
        codeTemplate: '<___>Hallo Welt</___>',
        blanks: ['p', 'p'],
        hint: 'Das Tag für einen Absatz hat nur einen Buchstaben.'
      },
      {
        id: 'w1-l3', type: 'code', title: 'Attribute nutzen', xp: 15,
        mode: 'html',
        intro: 'Attribute geben einem Tag zusätzliche Infos, z. B. href bei Links.',
        goalDescription: 'Erstelle einen Link (<a>) zu "https://example.com" mit dem sichtbaren Text "Klick mich".',
        starter: '<!-- Dein Code -->\n',
        validatorKey: 'html_link_basic'
      },
      {
        id: 'w1-l4', type: 'quiz', title: 'Bilder einbinden', xp: 10,
        intro: 'Bilder werden mit dem <img>-Tag eingebunden – es hat kein End-Tag.',
        question: 'Welches Attribut legt die Bildquelle fest?',
        choices: ['href', 'src', 'link', 'img'],
        correctIndex: 1,
        explanation: 'src (source) zeigt auf die Bilddatei, z. B. <img src="katze.jpg">.'
      },
      {
        id: 'w1-l5', type: 'code', title: 'Listen bauen', xp: 15,
        mode: 'html',
        intro: 'Eine ungeordnete Liste <ul> enthält Listenpunkte <li>.',
        goalDescription: 'Erstelle eine <ul> mit genau 3 <li>-Einträgen: "HTML", "CSS", "JavaScript".',
        starter: '<!-- Dein Code -->\n',
        validatorKey: 'html_list_three'
      },
      {
        id: 'w1-l6', type: 'code', title: 'Boss: Steckbrief', xp: 25, boss: true,
        mode: 'html',
        intro: 'Zeit, alles zu kombinieren!',
        goalDescription: 'Baue eine <h1> mit einem beliebigen Namen und darunter einen <p>-Absatz mit mindestens 5 Wörtern.',
        starter: '<!-- Dein Code -->\n',
        validatorKey: 'html_profile_card'
      }
    ]
  },
  {
    id: 'w2',
    nr: 2,
    title: 'CSS-Werkstatt',
    subtitle: 'Farbe, Form & Layout',
    icon: 'css',
    levels: [
      {
        id: 'w2-l1', type: 'quiz', title: 'Selektoren', xp: 10,
        intro: 'CSS-Regeln bestehen aus einem Selektor und Eigenschaften in { }.',
        question: 'Welcher Selektor wählt alle <p>-Elemente aus?',
        choices: ['#p', '.p', 'p', '*p'],
        correctIndex: 2,
        explanation: 'Ein Element-Selektor ist einfach der Tag-Name ohne Präfix.'
      },
      {
        id: 'w2-l2', type: 'code', title: 'Text stylen', xp: 15,
        mode: 'css',
        intro: 'Mit color und font-size veränderst du Text.',
        goalDescription: 'Style alle <p> so, dass color: red und font-size: 24px gilt. Nutze den Selektor "p".',
        starter: 'p {\n  \n}',
        htmlContext: '<p>Ich bin ein Testabsatz.</p>',
        validatorKey: 'css_p_red_24'
      },
      {
        id: 'w2-l3', type: 'fill', title: 'Das Box-Modell', xp: 10,
        intro: 'Jedes Element ist eine Box: Inhalt, padding, border, margin.',
        mode: 'text',
        codeTemplate: 'Der Abstand INNERHALB des Rahmens heißt ___, der Abstand AUSSERHALB heißt ___.',
        blanks: ['padding', 'margin'],
        hint: 'Beide Begriffe sind auf Englisch.'
      },
      {
        id: 'w2-l4', type: 'code', title: 'Box stylen', xp: 15,
        mode: 'css',
        intro: 'background-color, padding und border-radius formen eine Box.',
        goalDescription: 'Style ".card": background-color: #222; padding: 20px; border-radius: 10px.',
        starter: '.card {\n  \n}',
        htmlContext: '<div class="card">Karte</div>',
        validatorKey: 'css_card_box'
      },
      {
        id: 'w2-l5', type: 'code', title: 'Flexbox-Reihe', xp: 20,
        mode: 'css',
        intro: 'display: flex reiht Kindelemente nebeneinander an.',
        goalDescription: 'Style ".row" mit display: flex und justify-content: center.',
        starter: '.row {\n  \n}',
        htmlContext: '<div class="row"><div>A</div><div>B</div><div>C</div></div>',
        validatorKey: 'css_flex_row'
      },
      {
        id: 'w2-l6', type: 'code', title: 'Boss: Button-Design', xp: 25, boss: true,
        mode: 'css',
        intro: 'Ein guter Button braucht Farbe, Abstand und runde Ecken.',
        goalDescription: 'Style ".btn": background-color beliebig (nicht weiß/transparent), color: white, padding: 10px, border-radius mind. 4px.',
        starter: '.btn {\n  \n}',
        htmlContext: '<button class="btn">Los geht\'s</button>',
        validatorKey: 'css_button_boss'
      }
    ]
  },
  {
    id: 'w3',
    nr: 3,
    title: 'JavaScript-Start',
    subtitle: 'Variablen & Logik',
    icon: 'js',
    levels: [
      {
        id: 'w3-l1', type: 'quiz', title: 'Variablen deklarieren', xp: 10,
        intro: 'Mit let und const erstellst du Variablen. const ändert sich nie wieder.',
        question: 'Welches Schlüsselwort für einen Wert, der sich NICHT mehr ändern soll?',
        choices: ['var', 'let', 'const', 'static'],
        correctIndex: 2,
        explanation: 'const steht für "konstant" – der Wert bleibt fest.'
      },
      {
        id: 'w3-l2', type: 'code', title: 'Werte ausgeben', xp: 15,
        mode: 'js',
        intro: 'console.log() gibt Werte in der Konsole aus – dein Werkzeug zum Testen.',
        goalDescription: 'Erstelle "const name = " mit einem beliebigen Namen als Text und gib mit console.log(name) aus.',
        starter: '// Dein Code\n',
        validatorKey: 'js_const_log_string'
      },
      {
        id: 'w3-l3', type: 'quiz', title: 'Datentypen', xp: 10,
        intro: 'JavaScript kennt u. a. Zahlen (number), Text (string) und Wahrheitswerte (boolean).',
        question: 'Welchen Typ hat der Wert true?',
        choices: ['string', 'number', 'boolean', 'array'],
        correctIndex: 2,
        explanation: 'true/false sind Boolean-Werte.'
      },
      {
        id: 'w3-l4', type: 'code', title: 'Rechnen', xp: 15,
        mode: 'js',
        intro: 'Mit +, -, *, / rechnest du wie im Taschenrechner.',
        goalDescription: 'Erstelle "const summe" mit dem Ergebnis von 7 * 6 und gib summe mit console.log aus.',
        starter: '// Dein Code\n',
        validatorKey: 'js_math_42'
      },
      {
        id: 'w3-l5', type: 'code', title: 'Bedingungen', xp: 20,
        mode: 'js',
        intro: 'Mit if/else triffst du Entscheidungen im Code.',
        goalDescription: 'Erstelle "const alter = 20" und gib mit console.log "volljährig" aus, falls alter >= 18 ist, sonst "minderjährig".',
        starter: '// Dein Code\n',
        validatorKey: 'js_if_else_volljaehrig'
      },
      {
        id: 'w3-l6', type: 'code', title: 'Boss: Taschenrechner-Logik', xp: 25, boss: true,
        mode: 'js',
        intro: 'Kombiniere Variablen, Rechnen und Bedingungen.',
        goalDescription: 'Erstelle a = 10 und b = 3. Gib mit console.log aus, ob a größer als b ist: "a ist größer" oder "b ist größer oder gleich".',
        starter: '// Dein Code\n',
        validatorKey: 'js_compare_boss'
      }
    ]
  },
  {
    id: 'w4',
    nr: 4,
    title: 'Funktionen & Schleifen',
    subtitle: 'Code wiederverwenden',
    icon: 'loop',
    levels: [
      {
        id: 'w4-l1', type: 'quiz', title: 'Funktionen verstehen', xp: 10,
        intro: 'Eine Funktion ist ein wiederverwendbares Stück Code.',
        question: 'Wie startet man eine klassische Funktionsdeklaration?',
        choices: ['func meinName()', 'function meinName()', 'def meinName()', 'method meinName()'],
        correctIndex: 1,
        explanation: 'In JavaScript beginnt eine Funktion mit dem Schlüsselwort "function".'
      },
      {
        id: 'w4-l2', type: 'code', title: 'Eigene Funktion', xp: 15,
        mode: 'js',
        intro: 'Funktionen können Parameter annehmen und Werte zurückgeben (return).',
        goalDescription: 'Schreibe "function verdoppeln(zahl) { return zahl * 2; }" und rufe console.log(verdoppeln(5)) auf.',
        starter: '// Dein Code\n',
        validatorKey: 'js_function_double'
      },
      {
        id: 'w4-l3', type: 'quiz', title: 'For-Schleife', xp: 10,
        intro: 'Eine for-Schleife wiederholt Code eine bestimmte Anzahl Mal.',
        question: 'Wie viele Male läuft "for (let i = 0; i < 5; i++)"?',
        choices: ['4', '5', '6', 'unendlich'],
        correctIndex: 1,
        explanation: 'i läuft von 0 bis 4 – das sind 5 Durchläufe.'
      },
      {
        id: 'w4-l4', type: 'code', title: 'Schleife nutzen', xp: 20,
        mode: 'js',
        intro: 'Mit for kannst du z. B. Zahlen ausgeben.',
        goalDescription: 'Schreibe eine for-Schleife, die die Zahlen 1 bis 5 jeweils mit console.log ausgibt.',
        starter: '// Dein Code\n',
        validatorKey: 'js_for_loop_1to5'
      },
      {
        id: 'w4-l5', type: 'code', title: 'Arrays & forEach', xp: 20,
        mode: 'js',
        intro: 'Ein Array ist eine Liste von Werten: ["a","b","c"]. Mit forEach gehst du jeden Eintrag durch.',
        goalDescription: 'Erstelle "const farben = [\'rot\',\'grün\',\'blau\']" und gib jeden Eintrag mit farben.forEach und console.log aus.',
        starter: '// Dein Code\n',
        validatorKey: 'js_array_foreach'
      },
      {
        id: 'w4-l6', type: 'code', title: 'Boss: Zahlen-Filter', xp: 25, boss: true,
        mode: 'js',
        intro: 'Kombiniere Array, Schleife und Bedingung.',
        goalDescription: 'Erstelle "const zahlen = [1,2,3,4,5,6]" und gib mit einer for-Schleife und if nur die geraden Zahlen aus (Tipp: zahl % 2 === 0).',
        starter: '// Dein Code\n',
        validatorKey: 'js_even_filter_boss'
      }
    ]
  },
  {
    id: 'w5',
    nr: 5,
    title: 'DOM & Interaktion',
    subtitle: 'Webseiten lebendig machen',
    icon: 'dom',
    levels: [
      {
        id: 'w5-l1', type: 'quiz', title: 'Elemente finden', xp: 10,
        intro: 'document.querySelector(".klasse") findet das erste passende Element im HTML.',
        question: 'Wie wählt man ein Element mit der id "titel" aus?',
        choices: ['querySelector(".titel")', 'querySelector("#titel")', 'querySelector("titel")', 'getById("titel")'],
        correctIndex: 1,
        explanation: '# steht für eine ID, . steht für eine Klasse.'
      },
      {
        id: 'w5-l2', type: 'code', title: 'Text ändern', xp: 15,
        mode: 'js', domLevel: true,
        intro: 'Mit .textContent liest oder änderst du sichtbaren Text eines Elements.',
        goalDescription: 'Wähle das Element mit der Klasse "titel" aus und setze textContent auf "Verändert!".',
        starter: '// Dein Code\n',
        htmlContext: '<h2 class="titel">Original</h2>',
        validatorKey: 'js_dom_settext'
      },
      {
        id: 'w5-l3', type: 'code', title: 'Klassen umschalten', xp: 20,
        mode: 'js', domLevel: true,
        intro: 'classList.toggle("name") fügt eine CSS-Klasse hinzu oder entfernt sie.',
        goalDescription: 'Wähle das Element mit der Klasse "box" aus und füge ihm mit classList.add die Klasse "aktiv" hinzu.',
        starter: '// Dein Code\n',
        htmlContext: '<div class="box">Box</div>',
        validatorKey: 'js_dom_addclass'
      },
      {
        id: 'w5-l4', type: 'quiz', title: 'Events verstehen', xp: 10,
        intro: 'addEventListener reagiert auf Aktionen wie Klicks.',
        question: 'Welches Event feuert bei einem Mausklick?',
        choices: ['"hover"', '"click"', '"press"', '"tap"'],
        correctIndex: 1,
        explanation: '"click" ist das Standard-Event für Mausklicks (und Touch).'
      },
      {
        id: 'w5-l5', type: 'code', title: 'Klick-Reaktion', xp: 20,
        mode: 'js', domLevel: true,
        intro: 'Kombiniere Selektor + addEventListener, um auf Klicks zu reagieren.',
        goalDescription: 'Füge dem Button mit der Klasse "go" einen Klick-Listener hinzu, der den Text des Elements mit der Klasse "out" auf "Geklickt!" setzt.',
        starter: '// Dein Code\n',
        htmlContext: '<button class="go">Klick mich</button><p class="out">...</p>',
        validatorKey: 'js_dom_click_reaction'
      },
      {
        id: 'w5-l6', type: 'code', title: 'Boss: Zähler-Button', xp: 30, boss: true,
        mode: 'js', domLevel: true,
        intro: 'Ein klassischer Klick-Zähler kombiniert alles bisher Gelernte.',
        goalDescription: 'Baue einen Zähler: Bei jedem Klick auf ".plus" soll eine Zahl-Variable um 1 steigen und in ".count" angezeigt werden.',
        starter: '// Dein Code\nlet zaehler = 0;\n',
        htmlContext: '<button class="plus">+1</button><p class="count">0</p>',
        validatorKey: 'js_dom_counter_boss'
      }
    ]
  },
  {
    id: 'w6',
    nr: 6,
    title: 'Boss-Projekte',
    subtitle: 'Alles zusammen anwenden',
    icon: 'trophy',
    levels: [
      {
        id: 'w6-l1', type: 'code', title: 'To-Do hinzufügen', xp: 30, boss: true,
        mode: 'js', domLevel: true,
        intro: 'Ein Mini-To-Do: Klick auf den Button fügt einen neuen Listeneintrag hinzu.',
        goalDescription: 'Füge beim Klick auf ".add" ein neues <li> mit dem Text "Neue Aufgabe" zur Liste ".list" hinzu (Tipp: document.createElement + appendChild).',
        starter: '// Dein Code\n',
        htmlContext: '<button class="add">Hinzufügen</button><ul class="list"></ul>',
        validatorKey: 'js_todo_add_boss'
      },
      {
        id: 'w6-l2', type: 'code', title: 'Farbwechsler', xp: 30, boss: true,
        mode: 'js', domLevel: true,
        intro: 'Style.backgroundColor kannst du auch per JavaScript setzen.',
        goalDescription: 'Füge dem Button ".farbe" einen Klick-Listener hinzu, der die Hintergrundfarbe von ".flaeche" auf einen beliebigen CSS-Farbwert setzt (style.backgroundColor).',
        starter: '// Dein Code\n',
        htmlContext: '<button class="farbe">Farbe ändern</button><div class="flaeche" style="width:100px;height:60px;"></div>',
        validatorKey: 'js_color_changer_boss'
      },
      {
        id: 'w6-l3', type: 'code', title: 'Mini-Quiz-Karte', xp: 30, boss: true,
        mode: 'js', domLevel: true,
        intro: 'Prüfe Nutzereingaben mit einer Bedingung.',
        goalDescription: 'Füge dem Button ".check" einen Klick-Listener hinzu: Wenn der Wert von input ".answer" gleich "Paris" ist, setze den Text von ".result" auf "Richtig!", sonst auf "Nochmal!".',
        starter: '// Dein Code\n',
        htmlContext: '<p>Hauptstadt von Frankreich?</p><input class="answer" type="text"><button class="check">Prüfen</button><p class="result"></p>',
        validatorKey: 'js_quiz_card_boss'
      },
      {
        id: 'w6-l4', type: 'code', title: 'Finale: Eigene Mini-App', xp: 40, boss: true, final: true,
        mode: 'js', domLevel: true,
        intro: 'Der letzte Boss! Zeig, was du gelernt hast.',
        goalDescription: 'Baue eine kleine Interaktion: Bei Klick auf ".start" soll sich der Text von ".ziel" ändern UND classList "aktiv" zu ".ziel" hinzugefügt werden.',
        starter: '// Dein Code\n',
        htmlContext: '<button class="start">Start</button><p class="ziel">Bereit?</p>',
        validatorKey: 'js_final_boss'
      }
    ]
  }
];

// Gesamtzahl Level (für Fortschrittsanzeige)
const TOTAL_LEVELS = WELTEN.reduce((sum, w) => sum + w.levels.length, 0);

function getAllLevelsFlat() {
  const flat = [];
  WELTEN.forEach(welt => {
    welt.levels.forEach((lvl, idx) => {
      flat.push({ ...lvl, weltId: welt.id, weltTitle: welt.title, indexInWelt: idx });
    });
  });
  return flat;
}

function findLevelById(id) {
  for (const welt of WELTEN) {
    const lvl = welt.levels.find(l => l.id === id);
    if (lvl) return { level: lvl, welt };
  }
  return null;
}
