# English Dino Speaking Challenge
Files: english_dino_speaking_challenge.html (game), sw.js (service worker). Keep them in the same folder.

## Run on localhost
    cd english-dino && python3 -m http.server 8000   # open http://localhost:8000/english_dino_speaking_challenge.html
## Deploy on HTTPS
Upload both files to any HTTPS host (GitHub Pages, Netlify, school server), same folder.

## Test microphone permission
1. Open the page, press Start Game: Chrome asks once. Click Allow.
2. Record 10 words in a row: no new popup should appear; the line under the mic shows "Microphone ready".
3. Teacher panel > "Turn microphone off", then record: permission is requested again only if the browser needs it.
4. Close the tab: the mic indicator in the tab disappears.

## Test offline
1. Open online; wait for the model to load. Reload once so the service worker controls the page.
2. Teacher panel > CHECK OFFLINE READINESS: every line should say READY.
3. DevTools > Network > Offline (or disconnect), reload. The game must load, the model must initialise with no downloads, and recognition must work.
