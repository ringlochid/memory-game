# Memory Game — Speed Practice Todo Tree

> **Goal:** Build the entire memory game from Figma → working app without AI help.
> Track which skill bottleneck slows you down, not just total time.

---

## 🎯 Outcome Goal

- [ ] Finish a pixel-accurate, fully functional memory game in **under 6 hours**
- [ ] Zero AI agent assistance during the build
- [ ] All user stories from the README satisfied

## 📊 Metrics to Track Per Section

> For each section below, log: **start time → end time → time stuck → number of rewrites**

---

## 1. Design Translation (Target: ≤ 30 min)

> *Speed skill: reading the Figma and mapping it to code structure before touching the editor.*

- [x] Identify all pages/screens
  - [x] Start Game screen
  - [x] Game Board screen (solo + multiplayer)
  - [x] Mobile Menu overlay
  - [x] Game Over modal (solo)
  - [x] Game Over modal (multiplayer — winner + tie)
- [x] Map component tree
  - [x] `StartMenu` — theme/players/grid selectors + Start button
  - [x] `Header` — logo + action buttons (Restart / New Game / Menu)
  - [x] `GameBoard` — grid of `Card` components (4×4 or 6×6)
  - [x] `Card` — circle tile with face-down / face-up / matched states
  - [x] `StatsBar` — solo: Time + Moves | multi: Player score cards
  - [x] `MobileMenu` — overlay with Restart / New Game / Resume
  - [x] `GameOverModal` — results display (solo stats or ranked players)
- [x] Identify state needs
  - [x] Game settings (theme, player count, grid size)
  - [x] Board state (card values, flipped, matched)
  - [x] Turn tracking (current player, scores per player)
  - [x] Timer (solo mode only)
  - [x] Move counter
  - [x] Game phase (setup → playing → game-over)
- [x] Note responsive breakpoints: 375px / 768px / 1440px

---

## 2. Layout & Structure (Target: ≤ 60 min)

> *Speed skill: flex, grid, responsive containers — no visual polish yet.*

- [x] Start Game screen layout
  - [x] Centered card on dark background
  - [x] Title "memory" above card
  - [x] Vertical form layout: label + toggle group for each option
  - [x] Full-width "Start Game" button at bottom
- [x] Game screen layout
  - [x] Header: logo left, buttons right (desktop/tablet) or menu button (mobile)
  - [x] Game Board: centered grid with equal gaps
    - [x] 4×4 grid — larger circles
    - [x] 6×6 grid — smaller circles
  - [x] Stats Bar: horizontal row of stat boxes below grid
    - [x] Solo: 2 boxes (Time, Moves)
    - [x] Multiplayer: 2–4 player cards side-by-side
- [x] Mobile Menu overlay
  - [x] Full-screen semi-transparent backdrop
  - [x] Centered card with 3 stacked buttons
- [x] Game Over modal overlay
  - [x] Centered card with title, subtitle, stat rows, 2 action buttons
- [ ] Responsive adjustments
  - [ ] Mobile (375px): single-column player stats, Menu button replaces Restart/New Game
  - [ ] Tablet (768px): multi-column stats, full buttons in header
  - [ ] Desktop (1440px): max-width container, generous spacing

---

## 3. Styling & Tokens (Target: ≤ 45 min)

> *Speed skill: applying color, typography, spacing from design tokens without bikeshedding.*

- [x] Typography
  - [x] Font: Atkinson Hyperlegible (700 weight)
  - [x] Heading sizes per screen (title, modal heading, card numbers)
- [x] Color tokens
  - [x] Primary/Active: `#FDA214` (orange) — buttons, active player, badges
  - [x] Dark: `#152938` — face-down cards, headings, dark backgrounds
  - [x] Secondary: `#304859` — secondary text, secondary buttons
  - [x] Light: `#DFE7EC` — stat box backgrounds, inactive elements
  - [x] Background: `#FCFCFC` — page background
  - [x] Matched card: `#BCCED9` (grey-blue tint)
- [ ] Component-specific styling
  - [ ] Card circles: border-radius 50%, size varies by grid
  - [ ] Toggle buttons: pill-shaped, active = dark, inactive = light
  - [ ] Primary button: orange bg, white text, rounded
  - [ ] Secondary button: grey bg, dark text, rounded
  - [ ] Active player card: orange bg + pointer triangle indicator
  - [ ] Winner row: dark bg + "(Winner!)" badge in orange
- [ ] Hover / focus states
  - [ ] Buttons: lighter/darker shade on hover
  - [ ] Face-down cards: lighter blue on hover
  - [ ] Focus-visible outlines for accessibility

---

## 4. Game Logic (Target: ≤ 90 min)

> *Speed skill: state management decisions, event flow, clean separation of concerns.*

- [ ] Game setup
  - [ ] Generate shuffled card pairs (numbers 1–n or icon set)
  - [ ] Initialize board state from settings
  - [ ] Reset state on Restart / New Game
- [ ] Card interaction
  - [ ] Click to flip (only if < 2 cards revealed)
  - [ ] Compare 2 flipped cards after short delay
  - [ ] Match → keep face-up (matched state)
  - [ ] No match → flip both back (with delay for player to see)
  - [ ] Prevent clicking already-matched or currently-flipped cards
- [ ] Solo mode
  - [ ] Start timer on first card click
  - [ ] Increment move counter on every 2-card attempt
  - [ ] Stop timer when all pairs found
  - [ ] Show Game Over modal with Time Elapsed + Moves Taken
- [ ] Multiplayer mode (2–4 players)
  - [ ] Track scores per player (pairs found)
  - [ ] Rotate turn on mismatch; keep turn on match
  - [ ] Highlight active player with orange indicator
  - [ ] On game over: rank players, show winner or "It's a tie!"
- [ ] Edge cases
  - [ ] Rapid double-click on same card
  - [ ] Clicking during flip animation / comparison delay
  - [ ] All players tied at end
  - [ ] Odd number of cards edge (6×6 = 36 = 18 pairs ✓, 4×4 = 16 = 8 pairs ✓)

---

## 5. Integration & Polish (Target: ≤ 45 min)

> *Speed skill: wiring screens together, transitions, final pixel tweaks.*

- [ ] Screen transitions
  - [ ] Start Menu → Game Board (apply selected settings)
  - [ ] "New Game" → back to Start Menu
  - [ ] "Restart" → reset board with same settings
  - [ ] Game Over modal → "Restart" or "Setup New Game"
- [ ] Mobile menu toggle
  - [ ] Show/hide overlay on menu button click
  - [ ] "Resume Game" closes overlay
- [ ] Final responsive QA
  - [ ] Test at 375px, 768px, 1440px
  - [ ] Check card sizes scale properly between grid sizes
  - [ ] Verify stat bar doesn't overflow on mobile with 4 players
- [ ] Accessibility pass
  - [ ] Keyboard navigation through cards (tab + enter/space to flip)
  - [ ] Screen reader announcements for flips, matches, turns
  - [ ] Focus management on modal open/close
- [ ] Visual polish
  - [ ] Card flip animation
  - [ ] Smooth modal fade-in
  - [ ] Active player indicator transition

---

## 6. Debugging & Fixes (Track: time spent here)

> *Speed skill: this section should be as small as possible. Log every bug and how long it took to fix.*

- [ ] CSS overflow issues
- [ ] State sync bugs (stale closures, race conditions)
- [ ] Timer accuracy issues
- [ ] Responsive breakage at edge widths

---

## ⏱️ Time Log Template

| Section | Start | End | Stuck Time | Rewrites | Notes |
|---------|-------|-----|------------|----------|-------|
| 1. Design Translation | | | | | |
| 2. Layout & Structure | | | | | |
| 3. Styling & Tokens | | | | | |
| 4. Game Logic | | | | | |
| 5. Integration & Polish | | | | | |
| 6. Debugging & Fixes | | | | | |
| **Total** | | | | | |

---

## 🔍 After Each Run: Reflect

1. Which section took the longest? Why?
2. Where did you get stuck? Was it a **decision** problem or a **knowledge** problem?
3. What would you do differently next time to shave 30 minutes off?
4. Did you reach for the browser DevTools more than 5 times for CSS issues? → layout fundamentals need drilling
5. Did you rewrite any component more than once? → component planning needs work