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

| Command             | Purpose                                                     |
| ------------------- | ----------------------------------------------------------- |
| `npm run dev`       | Start the Vite development server on the network interface. |
| `npm start`         | Start the Vite development server.                          |
| `npm run typecheck` | Check TypeScript and Angular templates.                     |
| `npm test`          | Run game engine and controller tests.                       |
| `npm run build`     | Run type checks and create a production build.              |
| `npm run preview`   | Preview the production build locally.                       |

## How to play

Choose a faction, review its cards, and adjust your deck. In a match, place units in the row that matches their strength, use special cards and leader abilities when they can swing the score, and decide when to pass. Each round goes to the player with the higher total strength; win two rounds to take the match. The game includes an opening-hand exchange and a graveyard for cards removed from play.

## Project structure

```text
src/app/
  pages/                 Analog file route (index.page.ts) and top-level screen composition
  game/
    engine.ts            Game rules, scoring, deck validation, and AI
    game.store.ts        Match controller, UI state, settings, and lifecycle
    models.ts            Shared game types
    components/          Battlefield, deck builder, cards, details, portraits, overlay dialog
    motion/              Game-specific motion built on Angular Movement (score bump)
src/styles.css           Imports Tailwind, the Volt theme preset and the partials below
src/styles/              tokens, base, card, menu, faction, deck, prepare, battle, dialogs, result
public/assets/           Faction and card artwork
tests/                   Engine and controller tests
```

The rules engine is kept independent of Angular. The page-level component provides the match store, while focused standalone components render the deck builder, battlefield and dialogs. Angular signals drive view updates; Analog provides file-based routing and Vite handles development and builds.

## UI library integration

Each library owns one concern, and the app does not re-implement what a library already provides.

| Library                                          | Owns                                                                                                                                                                                                                                                                                                                                       | Where                                                                                                                                                                                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Volt UI** (`@voltui/components`, package mode) | Every UI atom: buttons, badges, cards/panels, avatars, dialog, radio groups, switches, slider, toggle group (deck filter), meters (deck rules), alerts, empty states, table, toasts.                                                                                                                                                       | All templates. Theme: `provideVoltTheme` + the `sage-sharp` preset; `src/styles/tokens.css` maps the game palette and each faction onto Volt's semantic tokens (`--primary`, `--surface`, …), so dialogs portalled to `<body>` follow the faction too. |
| **Quartz Headless**                              | Behaviour Volt does not cover: drag & drop from hand to rows (`qzDraggable` / `qzDropZone`), tooltips on icon-only buttons (`qzTooltip`, styled with Volt tokens via `[data-qz-tooltip]`), and the reactive viewport (`ViewportService`), which drives hand/mulligan pagination in the store and decides which panels are rendered at all. | `battlefield`, `deck-builder`, `index.page`, `game.store.ts`                                                                                                                                                                                           |
| **Angular Movement**                             | Screen entrances, staggered grids (`moveStagger` + `moveInView`), hover/tap feedback (`moveWhileHover="lift"` / `moveWhileTap="press"`), cards entering the board, the turn pulse, and the score/counter bump (`gameBump`, built on the imperative `MoveAnimator`). Reduced motion is honoured automatically.                              | All screens, `game/motion/bump.directive.ts`                                                                                                                                                                                                           |
| **Lumen Icons**                                  | Every UI glyph (settings, navigation, close, pass, archive, weather, rounds won with `variant="filled"`…), imported per icon from `lumen-icons/<name>` for tree-shaking. Card ability and row symbols stay as game artwork.                                                                                                                | All templates                                                                                                                                                                                                                                          |

Conventions:

- Playing cards are a **domain component** (`button[gameCard]` / `div[gameCard]`), not a Volt button: their face is game artwork and scales with container queries (`src/styles/card.css`).
- Styles never restyle a Volt component's internals. They size or place it, or change tokens.
- Don't hide animated elements with `display: none`. Render them conditionally (`ViewportService.observe(...)`) instead. Angular Movement 1.2 calls `commitStyles()` when an animation finishes, and that throws on elements that are not rendered.
- Volt's MCP server (`.mcp.json`) and skills (`.claude/skills`, `.agents/skills`) are configured for AI agents: `npx @voltui/agent doctor` checks them.

Run `npm test` and `npm run build` after changing the integration. For browser checks, run `npm run dev` and verify settings (keyboard focus, switches, slider), deck filter and meters, card exchange, card placement by click/keyboard/drag, and round continuation on desktop, tablet, phone and landscape phone.

## Build and deploy

```sh
npm run build
npm run preview
```

The client output is written to `dist/client`. Deploy that directory to a static host. The app expects to be served from the domain root because its assets use root-relative paths. If you add routes, configure the host to fall back to `index.html`.

## Notes

- Match state exists only in memory and resets when the page reloads. Decks and preferences are saved in local storage on the current browser.
- `.npmrc` sets `legacy-peer-deps=true` because Quartz Headless and Lumen Icons still declare `@angular/core ^21` as their peer range. The flag also hides _missing_ peers, so required peers are listed explicitly in `package.json` (`@angular/forms` for Volt/ng-primitives, `front-matter` for `@analogjs/content`). Remove the flag once those peer ranges include Angular 22.
- The game uses Angular, Analog, Tailwind CSS, Volt UI, Quartz Headless, Angular Movement and Lumen Icons. See `package.json` for the complete dependency list.
