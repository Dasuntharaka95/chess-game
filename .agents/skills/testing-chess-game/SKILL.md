# Testing Chess Game

## Local Setup

1. Install dependencies: `npm install`
2. Start local server: `python3 -m http.server 8080` from the repo root
3. Open `http://localhost:8080` in Chrome
4. Hard-reload (`Ctrl+Shift+R`) if CSS changes aren't reflected (browser caches aggressively)

## Architecture

- Static HTML/CSS/JS app — no backend, no database
- Entry point: `index.html`
- Game logic: `js/main.js` (board setup, move validation, drag-and-drop handlers)
- Bot AI: `js/bot.js` (minimax with alpha-beta pruning)
- Piece SVGs: `js/pieces.js`
- Styling: `css/style.css`

## Game Flow

1. **Mode Selection**: On page load, a selection screen shows "2 Players" and "vs Bot" buttons
2. **2 Players**: Standard two-player mode. Black moves first, then white. Board IDs reverse (`reverseIds`/`revertIds`) after each turn.
3. **vs Bot**: Human plays black, bot plays white. After human moves, `triggerBotMove()` fires with 600ms delay. Bot uses `findBestMove()` (minimax depth 2).

## Testing Drag-and-Drop

**Known limitation**: HTML5 drag-and-drop via GUI computer-use tools is unreliable for this app, especially after board ID reversal (`reverseIds`). 

**Workaround**: Use Playwright CDP or browser console to dispatch DragEvents programmatically:

```javascript
const fromSq = document.querySelector('[square-id="12"]');
const toSq = document.querySelector('[square-id="20"]');
const piece = fromSq.querySelector('.pieces');
const dt = new DataTransfer();
piece.dispatchEvent(new DragEvent('dragstart', {bubbles: true, cancelable: true, dataTransfer: dt}));
toSq.dispatchEvent(new DragEvent('dragover', {bubbles: true, cancelable: true, dataTransfer: dt}));
toSq.dispatchEvent(new DragEvent('drop', {bubbles: true, cancelable: true, dataTransfer: dt}));
```

## Key Assertions to Verify

- **Mode selection**: `#modeSelect` visible on load, `#gameBody` has `.hide` class
- **Board rendering**: 64 `.square` elements, 32 `.pieces` elements at start
- **Turn tracking**: `#player` text alternates between 'black' and 'white'
- **Bot response**: In bot mode, after black moves, wait ~800ms for bot (600ms delay + processing). Verify turn returns to 'black'.
- **Score tracking**: `#white_score` and `#black_score` update on captures. Pawn=10, knight=30, bishop=30, rook=50, queen=90, king=900.
- **Bot blocking**: In bot mode, `dragStart` returns early when `playerGo === 'white'`

## Devin Secrets Needed

None — this is a static app with no authentication.
