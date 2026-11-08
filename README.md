# Duel of Factions

A single-player strategy card game about building a faction deck, reading the board, and choosing when to commit or pass. Play in your browser against a local AI. No account, server, or API key is required.

## Features

- Choose from four factions, each with its own cards, leader, and play style.
- Customize your deck before a match and exchange up to two cards from your opening hand.
- Play across melee, ranged, and siege rows with weather, special effects, and faction abilities.
- Compete against a local AI at multiple difficulty levels in a best-of-three match.
- Switch between English, Spanish, and Ukrainian.
- Play on desktop or mobile, with responsive hands and touch-friendly controls.
- Adjust music and sound effects; audio is generated with the Web Audio API.
- Keep language, decks, difficulty, and audio settings in browser local storage.

## Requirements

- Node.js 24 (the repository includes an `.nvmrc`).
- npm, included with Node.js.

## Run locally

```sh
nvm use
npm ci
npm run dev
```

Open the local URL printed by Vite. The game runs entirely in the browser.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server on the network interface. |
| `npm start` | Start the Vite development server. |
| `npm run typecheck` | Check TypeScript and Angular templates. |
| `npm test` | Run game engine and controller tests. |
| `npm run build` | Run type checks and create a production build. |
| `npm run preview` | Preview the production build locally. |

## How to play

Choose a faction, review its cards, and adjust your deck. In a match, place units in the row that matches their strength, use special cards and leader abilities when they can swing the score, and decide when to pass. Each round goes to the player with the higher total strength; win two rounds to take the match. The game includes an opening-hand exchange and a graveyard for cards removed from play.

## Project structure

```text
src/app/
  pages/                 Route and top-level screen composition
  game/
    engine.ts            Game rules, scoring, deck validation, and AI
    game.store.ts        Match controller, UI state, settings, and lifecycle
    models.ts            Shared game types
    components/          Battlefield, deck builder, cards, details, portraits, overlays
public/assets/           Faction and card artwork
tests/                    Engine and controller tests
```

The rules engine is kept independent of Angular. The page-level component provides the match store, while focused standalone components render the deck builder and battlefield. Angular signals drive view updates; Analog provides file-based routing and Vite handles development and builds.

## UI library integration

- Volt UI supplies native button variants, badges, and the mobile deck filter. The imported `sage-sharp` CSS preset matches `provideVoltTheme`; game color tokens and faction colors remain in `src/styles.css`.
- Angular Movement handles screen and dialog entrances, hover/tap feedback, and turn indicators. It respects the system's reduced motion preference; the stylesheet applies that preference to Volt's CSS transitions too. Disabled actions also disable their movement directives.
- Quartz Headless manages modal focus trapping, focus restoration, background isolation, audio switches, toasts, and card drag and drop. Round results and revival choices require an explicit game action; other dialogs support Escape and backdrop dismissal. Dialog names and switch labels follow the selected language.
- Dragged cards are validated against the current hand. Click selection and Enter/Space on highlighted rows provide the keyboard alternative to dragging.

Run `npm test` and `npm run build` after changing the integration. For browser checks, run `npm run preview` and verify settings (including keyboard focus and switches), deck filters, card exchange, card placement by click/keyboard/drag, and round continuation on desktop and mobile.

## Build and deploy

```sh
npm run build
npm run preview
```

The client output is written to `dist/client`. Deploy that directory to a static host. The app expects to be served from the domain root because its assets use root-relative paths. If you add routes, configure the host to fall back to `index.html`.

## Notes

- Match state exists only in memory and resets when the page reloads. Decks and preferences are saved in local storage on the current browser.
- `.npmrc` enables reproducible installs despite the current peer dependency range declared by Quartz Headless for Angular. Check upstream peer support when upgrading either dependency.
- The game uses Angular, Analog, Tailwind CSS, Volt UI, Quartz Headless, and Angular Movement. See `package.json` for the complete dependency list.
