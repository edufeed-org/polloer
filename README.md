# README

## Projektbeschreibung
![](https://pad.gwdg.de/uploads/101dc1e7-3268-4d0e-b130-fde274425be4.png =x200)

*Abb.: Projektsymbolik – Ein Nutzer poliert eine Umfrage (Symbolbild).*

**Polloer** ist eine Webanwendung zum dezentralen Sammeln und Bewerten von Ideen. Die Applikation basiert auf SvelteKit und nutzt das Nostr-Protokoll (über das Nostr Development Kit, *NDK*), um Beiträge nicht auf einem eigenen Server, sondern in einem dezentralen Netzwerk von Relays zu speichern. Dadurch entsteht ein kollaboratives Tool, mit dem Nutzer gemeinsam Ideen austauschen und per Abstimmung priorisieren können – vollständig **serverlos** und offen.

Hauptfunktionen von Polloer sind unter anderem:

* **Ideensammlungen erstellen:** Jeder Nutzer kann eine neue Fragestellung oder ein Thema erstellen, zu dem Ideen gesammelt werden. Diese *Session* erhält automatisch eine kurze ID und einen QR-Code, über die weitere Teilnehmer beitreten können.
* **Echtzeit-Ideen sammeln:** Teilnehmer, die einer Ideensammlung beigetreten sind, können ihre Ideen und Vorschläge in Echtzeit hinzufügen. Alle Beiträge erscheinen sofort bei allen Teilnehmern – die Anwendung aktualisiert sich live.
* **Abstimmen (Voting):** Der Initiator kann die Abstimmungsphase starten. Dann können alle Teilnehmer per 👍-Klick für die besten Ideen stimmen. Die Anzahl der Stimmen pro Beitrag wird live angezeigt, sodass am Ende ersichtlich ist, welche Ideen am meisten Zustimmung erhalten haben.
* **Dezentrale Datenhaltung:** Alle Fragen, Ideen und Votes werden als Nostr-Events gespeichert. Die Daten liegen nicht bei einem zentralen Dienst, sondern auf konfigurierten Nostr-Relays. Nutzer können einen Nostr-Browser-Extension (wie Alby) zur Authentifizierung nutzen oder es wird automatisch ein Schlüssel für sie erzeugt, um im Hintergrund am Netzwerk teilzunehmen.

Diese Funktionen machen Polloer zu einem nützlichen Werkzeug für Brainstorming-Sitzungen, Workshops oder Umfragen, bei denen Teilnehmer ortsunabhängig Ideen sammeln und bewerten möchten. Durch die dezentrale Architektur bleiben die Inhalte im Besitz der Nutzer und können prinzipiell von jedem Nostr-Client aus eingesehen werden.

## Voraussetzungen und Installation

Um Polloer lokal auszuführen, werden folgende Voraussetzungen empfohlen:

* **Node.js** in aktueller Version (getestet mit Node 20+).
* Optional: Eine Nostr-Browsererweiterung (z.B. die [Alby Wallet](https://getalby.com/) oder Nos2x), um das eigene Schlüsselpaar zu nutzen. *Ohne Extension generiert die Anwendung einen temporären Schlüssel.*

**Schritt 1: Repository klonen**
Laden Sie den Quellcode von Polloer herunter, entweder als ZIP oder per Git-Klon:

```bash
git clone <URL-zum-Polloer-Repository>.git
cd polloer-main
```

**Schritt 2: Abhängigkeiten installieren**
Stellen Sie sicher, dass Sie sich im Projektverzeichnis befinden, und führen Sie die Installation mit npm (oder einem Paketmanager Ihrer Wahl) aus:

```bash
npm install
```

Dies lädt alle benötigten Bibliotheken, darunter SvelteKit, NDK, TailwindCSS usw.

**Schritt 3: Entwicklungserver starten**
Starten Sie die Anwendung im Entwicklungsmodus:

```bash
npm run dev
```

Standardmäßig öffnet SvelteKit einen lokalen Server (meist unter [http://localhost:5173](http://localhost:5173)). Die Konsole wird die genaue Adresse ausgeben. Rufen Sie diese in einem Browser auf. Jetzt können Sie die Anwendung ausprobieren. Änderungen am Quellcode werden automatisch neu geladen.

**Optional – Docker verwenden:**
Alternativ ist eine Docker-Umgebung vorbereitet. Stellen Sie sicher, dass Docker installiert ist, und führen Sie dann im Projektverzeichnis aus:

```bash
docker-compose up --build
```

Dieser Befehl baut das Docker-Image und startet den Container. Die App wird im Produktivmodus gestartet und ist unter [http://localhost:4173](http://localhost:4173) erreichbar. Dies ist praktisch, um Polloer auszuführen, ohne Node.js auf dem Host installieren zu müssen.

## Nutzung

Nach dem Start der Anwendung (lokal oder im Docker) kann Polloer folgendermaßen genutzt werden:

1. **Startseite – Session erstellen oder beitreten:** Auf der Startseite haben Sie zwei Optionen:

   * **Einer Ideensammlung beitreten:** Wenn Sie von jemandem eine Session-ID (achtstellige Zahl) erhalten haben, können Sie diese in das Feld *"12345678"* eingeben. Klicken Sie dann auf **"Teilnehmen"**, um der entsprechenden Ideensammlung beizutreten. Alternativ können Sie auch den von dem Organisator geteilten Link oder QR-Code scannen – dieser führt Sie ebenfalls direkt zur Session.
   * **Neue Ideensammlung starten:** Um selbst eine Session zu initiieren, klicken Sie auf **"Eine Ideensammlung starten"**. Geben Sie in dem Editor-Feld Ihre **Frage oder das Thema** ein, zu dem Sie Ideen sammeln möchten (Markdown-Format wird unterstützt). Mit einem Klick auf **"Starten"** wird die Session erstellt. Es erscheint anschließend eine Ansicht mit einem **QR-Code** und der **Kurz-ID** Ihrer Sammlung.

2. **Teilnehmer einladen:** Teilen Sie den angezeigten Zahlencode oder den QR-Code mit den Personen, die an der Brainstorming-Runde teilnehmen sollen. Diese können entweder über die Polloer-Weboberfläche (Startseite -> Eingabe der ID) oder über direktes Aufrufen des Links (der Link enthält bereits die ID) Ihrer Session beitreten.

3. **Ideen sammeln:** Sobald die Teilnehmer beigetreten sind, sehen alle die **Frage/Thema** und können darunter über ein Eingabefeld ihre **Ideen** hinzufügen. Jeder eingegebene Vorschlag wird durch Klick auf **"Hinzufügen"** an alle gesendet und erscheint unmittelbar in der Liste darunter. Da Polloer in Echtzeit über Nostr synchronisiert, sehen alle Teilnehmer die neuen Beiträge ohne Verzögerung.

4. **Ideen anzeigen:** Die eingegangenen Ideen/Antworten werden in einer Liste unterhalb der Frage angezeigt. Zunächst ist die Voting-Funktion deaktiviert – dies erlaubt es, frei Ideen zu sammeln, ohne dass bereits gewertet wird. Jede Idee wird in einer separaten Karte angezeigt; die Formatierung entspricht dem eingegebenen Markdown (z.B. Listen, Fettdruck etc. sind möglich).

5. **Voting starten (für Organisator):** Wenn genügend Ideen gesammelt wurden, kann der Ersteller der Session die Abstimmung freigeben. Dazu erscheint für ihn ein Button **"Reaktionen/Voting aktivieren"** (sichtbar nur für den Autor der Frage). Ein Klick darauf öffnet die Voting-Phase: nun erscheint bei allen Beiträgen ein **Daumen-hoch-Button**.

6. **Für Ideen abstimmen:** Alle Teilnehmer können jetzt die Ideen durch Klick auf den 👍-Button bewerten. Jeder Teilnehmer kann pro Idee **eine Stimme** abgeben. Nach dem Klick wird der Button durch den Text *"Danke für deinen Vote!"* ersetzt, um anzuzeigen, dass die Stimme gezählt wurde. Die Anzahl der erhaltenen Stimmen jeder Idee wird live neben dem Daumen-Symbol angezeigt (z.B. "👍 3" für drei Votes).

7. **Ergebnisse betrachten:** Während der Voting-Phase lässt sich sofort erkennen, welche Ideen besonders beliebt sind. Am Ende kann man anhand der Zahlen einfach ablesen, welche Vorschläge am meisten Zustimmung fanden. Diese Ergebnisse können für weitere Diskussionen oder Entscheidungen genutzt werden.

Hinweise:

* **Authentifizierung:** Polloer kümmert sich automatisch um die technische Anmeldung am dezentralen Netzwerk. Falls Sie eine Nostr-Browsererweiterung installiert haben, nutzt die App diese für kryptographische Signaturen. Falls nicht, wird im Hintergrund ein Schlüssel erzeugt. Sie müssen als Nutzer nichts weiter tun – die App zeigt lediglich einen **"Login"**-Button an, falls noch kein Schlüssel vorhanden ist. In der Regel wird dieser automatisch beim ersten Laden gesetzt.
* **Datenschutz:** Da alle Inhalte über das öffentliche Nostr-Netz verbreitet werden, sollten keine sensiblen oder geheimen Informationen in den Fragen oder Ideen verwendet werden. Jeder mit Kenntnis der Session-ID und Zugriff auf das verwendete Relay könnte theoretisch die Daten auslesen. Für Test- und Demo-Zwecke nutzt Polloer standardmäßig einen Relay-Server (`relay-rpi.edufeed.org`); dies kann in der Konfiguration angepasst werden.
* **Mehrere Relays:** Derzeit ist in der Standardeinstellung nur ein Relay eingebunden. In der Praxis lässt sich Polloer erweitern, um mehrere Relays parallel zu nutzen, um Ausfallsicherheit zu erhöhen. Hierfür müsste die Konfiguration in `stores.js` angepasst werden (NDK erlaubt eine Liste von Relay-URLs).

