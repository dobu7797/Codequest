# CodeQuest 🔌

Eine spielerische Coding-Lern-PWA im "Leiterbahn"-Design. Level für Level lernst
du HTML, CSS und JavaScript – mit Quiz-Fragen, Lückentexten und echtem
Code-Editor samt Live-Vorschau. Läuft komplett offline, Fortschritt wird lokal
im Browser gespeichert.

## Lokal testen

Da die App `fetch`/Service-Worker nutzt, reicht Doppelklick auf `index.html`
nicht – starte einen kleinen lokalen Server:

```bash
cd coding-quest
python3 -m http.server 8080
```

Dann im Browser öffnen: `http://localhost:8080`

## Auf GitHub Pages veröffentlichen

1. Neues GitHub-Repository erstellen (z. B. `codequest`).
2. Den kompletten Inhalt dieses Ordners in das Repo pushen:
   ```bash
   git init
   git add .
   git commit -m "CodeQuest MVP"
   git branch -M main
   git remote add origin https://github.com/DEIN-NAME/codequest.git
   git push -u origin main
   ```
3. Im Repo unter **Settings → Pages**:
   - Source: `Deploy from a branch`
   - Branch: `main`, Ordner `/ (root)`
   - Speichern.
4. Nach ein bis zwei Minuten ist die App unter
   `https://DEIN-NAME.github.io/codequest/` erreichbar.
5. Auf dem Handy: Seite öffnen → "Zum Startbildschirm hinzufügen" →
   App startet danach wie eine native App (PWA, installierbar, offline-fähig).

Alle Pfade in `index.html`, `manifest.json` und `service-worker.js` sind
**relativ**, die App funktioniert daher egal ob sie auf `username.github.io`
oder `username.github.io/repo-name/` liegt.

## Struktur

```
coding-quest/
├── index.html            # Einstiegspunkt, App-Shell
├── manifest.json          # PWA-Manifest
├── service-worker.js       # Offline-Caching
├── css/style.css           # Gesamtes Design (Leiterbahn-Theme)
├── icons/                  # App-Icons
└── js/
    ├── data/levels.js       # Alle Welten & Level-Inhalte
    ├── engine/validators.js # Prüft Code-Level automatisch
    ├── engine/codeRunner.js # Führt Nutzer-Code sicher in iframe aus
    ├── engine/progress.js   # localStorage: XP, Sterne, Freischaltungen
    ├── engine/mapRenderer.js# Zeichnet den Leiterbahn-Pfad
    └── app.js               # Routing & Interaktionen
```

## Aktueller Umfang (v1)

- **Welt 1:** HTML-Fundament
- **Welt 2:** CSS-Werkstatt
- **Welt 3:** JavaScript-Start
- **Welt 4:** Funktionen & Schleifen
- **Welt 5:** DOM & Interaktion
- **Welt 6:** Boss-Projekte (Mini-Apps)

34 Level, drei Aufgabentypen (Quiz, Lückentext, freier Code mit
Live-Vorschau + automatischer Prüfung), Sterne-Bewertung, XP-System,
Tages-Streak, sequenzielle Freischaltung.

## Nächste Ausbaustufen (Ideen)

- Weitere Sprachen als neue "Boards" (z. B. Python via Pyodide)
- Syntax-Highlighting im Editor (z. B. eigenes leichtes Highlighting)
- Soundeffekte / Haptik bei Erfolg
- Cloud-Sync des Fortschritts (aktuell nur lokal im Browser)
- Bestenliste / Freunde
