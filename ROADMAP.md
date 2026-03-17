# Memory Game — Speed Practice Todo Tree

> **Goal:** Build the entire memory game from Figma → working app without AI help.
> Track which skill bottleneck slows you down, not just total time.

---

## 🎯 Outcome Goal

- [x] Finish a pixel-accurate, fully functional memory game in **under 6 hours**
- [x] Zero AI agent assistance during the build
- [x] All user stories from the README satisfied

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
- [x] Responsive adjustments
  - [x] Mobile (375px): single-column player stats, Menu button replaces Restart/New Game
  - [x] Tablet (768px): multi-column stats, full buttons in header
  - [x] Desktop (1440px): max-width container, generous spacing

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
- [x] Component-specific styling
  - [x] Card circles: border-radius 50%, size varies by grid
  - [x] Toggle buttons: pill-shaped, active = dark, inactive = light
  - [x] Primary button: orange bg, white text, rounded
  - [x] Secondary button: grey bg, dark text, rounded
  - [x] Active player card: orange bg + pointer triangle indicator
  - [x] Winner row: dark bg + "(Winner!)" badge in orange
- [x] Hover / focus states
  - [x] Buttons: lighter/darker shade on hover
  - [x] Face-down cards: lighter blue on hover
  - [x] Focus-visible outlines for accessibility

---

## 4. Game Logic (Target: ≤ 90 min)

> *Speed skill: state management decisions, event flow, clean separation of concerns.*

- [x] Game setup
  - [x] Generate shuffled card pairs (numbers 1–n or icon set)
  - [x] Initialize board state from settings
  - [x] Reset state on Restart / New Game
- [x] Card interaction
  - [x] Click to flip (only if < 2 cards revealed)
  - [x] Compare 2 flipped cards after short delay
  - [x] Match → keep face-up (matched state)
  - [x] No match → flip both back (with delay for player to see)
  - [x] Prevent clicking already-matched or currently-flipped cards
- [x] Solo mode
  - [x] Start timer on first card click
  - [x] Increment move counter on every 2-card attempt
  - [x] Stop timer when all pairs found
  - [x] Show Game Over modal with Time Elapsed + Moves Taken
- [x] Multiplayer mode (2–4 players)
  - [x] Track scores per player (pairs found)
  - [x] Rotate turn on mismatch; keep turn on match
  - [x] Highlight active player with orange indicator
  - [x] On game over: rank players, show winner or "It's a tie!"
- [x] Edge cases
  - [x] Rapid double-click on same card
  - [x] Clicking during flip animation / comparison delay
  - [x] All players tied at end
  - [x] Odd number of cards edge (6×6 = 36 = 18 pairs ✓, 4×4 = 16 = 8 pairs ✓)

---

## 5. Integration & Polish (Target: ≤ 45 min)

> *Speed skill: wiring screens together, transitions, final pixel tweaks.*

- [x] Screen transitions
  - [x] Start Menu → Game Board (apply selected settings)
  - [x] "New Game" → back to Start Menu
  - [x] "Restart" → reset board with same settings
  - [x] Game Over modal → "Restart" or "Setup New Game"
- [x] Mobile menu toggle
  - [x] Show/hide overlay on menu button click
  - [x] "Resume Game" closes overlay
- [x] Final responsive QA
  - [x] Test at 375px, 768px, 1440px
  - [x] Check card sizes scale properly between grid sizes
  - [x] Verify stat bar doesn't overflow on mobile with 4 players
- [x] Accessibility pass
  - [x] Keyboard navigation through cards (tab + enter/space to flip)
  - [x] Screen reader announcements for flips, matches, turns
  - [x] Focus management on modal open/close
- [x] Visual polish
  - [x] Card flip animation
  - [x] Smooth modal fade-in
  - [x] Active player indicator transition

---

## 6. Debugging & Fixes (Track: time spent here)

> *Speed skill: this section should be as small as possible. Log every bug and how long it took to fix.*

- [x] CSS overflow issues
- [x] State sync bugs (stale closures, race conditions)
- [x] Timer accuracy issues
- [x] Responsive breakage at edge widths

---

## ⏱️ Time Log

| Section | Time Spent | Bottleneck / Notes |
|---------|-------|-------|
| 1. Design Translation | 30m | Smooth. Mapped the components and states quickly. |
| 2. Layout & Structure | 70m | Got hung up mapping exact Tailwind pixel values. |
| 3. Styling & Tokens | 30m | Easy execution of colors and fonts. |
| 4. Game Logic | 5h | **Massive Bottleneck.** Struggled with state sync bugs, race conditions with `setTimeout`, and tightly coupled UI/Business logic in a massive hook. |
| 5. Integration & Polish | 40m | Smooth wiring of everything together. |
| 6. Debugging & Fixes | (Included above) | Fixed CSS issues and timeout race conditions. |
| **Total** | **~8 hours** | Target was 6 hours. Missed target entirely due to Phase 4. |

---

## 🔍 Reflection

1. **Which section took the longest? Why?**
   Game Logic took 5 hours. My initial architecture tried to handle UI flow, async timeouts, and game rules all within a giant `useGameLogic` hook using multiple setter-based dispatch actions (`FLIP`, then `SCORE`, then `CHANGE_TURN`). This caused massive race conditions and mental overhead when trying to coordinate multiple side effects simultaneously.

2. **Where did you get stuck? Was it a decision problem or a knowledge problem?**
   It was an *architectural* problem. I didn't realize that firing multiple dispatch actions sequentially with async timeouts between them would cause stale state closures (hitting "Restart" while a match-check timeout was running corrupted the newly reset board).

3. **What would you do differently next time?**
   **Fat Reducer, Skinny Components.** Next time, I will use *event-based logic* instead of *setter-based logic*. The UI should only dispatch single semantic events (`EVALUATE_MATCH_ATTEMPT`), and the reducer should be a pure synchronous function that calculates the consequences (score, turns, card states) atomically. I will also make async delays a *reaction* to state changes (`status === 'RESOLVING'`) rather than the *cause* of state changes in the hook.