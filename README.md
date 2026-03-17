# Memory Game

![Design preview for the Memory game coding challenge](./preview.jpg)

## 🎯 What I Built

A fully functional, pixel-perfect, and heavily state-driven Memory Game. It includes:
- **Solo Mode**: Tracks time elapsed and moves taken.
- **Multiplayer Mode (2-4 Players)**: Alternates turns, tracks individual scores, highlights the active player, and determines a winner (or tie).
- **Responsive Design**: Scales flawlessly across Mobile (375px), Tablet (768px), and Desktop (1440px) matching the strict Figma layout.
- **Dynamic Board**: Supports 4x4 and 6x6 grid configurations, dynamically scaling the cards using tailwind mapping.

## 🛠️ How I Built It (Tech Stack)

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 using semantic utility tokens matched directly to the Figma file properties.
- **State Management**: React `useReducer` and `Context API`.

## 🧠 What I Learned (The Hard Way)

The biggest challenge in this project wasn't the layout—it was the **Game Logic State Machine**.

I initially attempted to handle the game's intelligence in a massive `useGameLogic` hook using multiple sequential dispatch actions (e.g. `dispatch(FLIP)`, wait 700ms, `dispatch(UPDATE_SCORE)`, `dispatch(CHANGE_TURN)`). This resulted in severe mental overhead and dangerous **Race Conditions**—specifically, if a user clicked "Restart" while a 700ms match-resolution timeout was ticking, the pending asynchronous timeout would fire against the newly-reset board and corrupt the game state.

### Key Architectural Takeaways to Improve Next Time

1. **Fat Reducers, Skinny Components**: The UI should not orchestrate the game. I learned to shift from *setter-based* dispatch actions to *event-based* semantic actions. Instead of telling the Context what to change, the UI simply says `dispatch({ type: 'EVALUATE_MATCH_ATTEMPT' })`. The Reducer becomes a pure synchronous function that atomically calculates the new state, score, and active player all at once to prevent React batching clobbers.
2. **Async Timers as Reactions**: Instead of `setTimeout` firing state changes, state changes should trigger `setTimeout`. By setting a global state `status === 'RESOLVING'`, a simple `useEffect` can watch that state and handle the 700ms visual delay. If the game resets, the effect cleanly unmounts via `clearTimeout`, permanently eliminating async race conditions.