# Duel of Factions

A single-player strategy card game about building a faction deck, reading the board, and choosing when to commit or pass. Play in your browser against a local AI. No account or API key is required, and the game itself never calls a server. The site also serves a server-rendered card codex and a public game-data API.

## Features

- Choose from four factions, each with its own cards, leader, and play style.
- Customize your deck before a match and exchange up to two cards from your opening hand.
- Play across melee, ranged, and siege rows with weather, special effects, and faction abilities.
- Compete against a local AI at multiple difficulty levels in a best-of-three match.
- Switch between English, Spanish, and Ukrainian.
- Play on desktop or mobile, with responsive hands and touch-friendly controls.
- Adjust music and sound effects; audio is generated with the Web Audio API.
- Keep language, decks, difficulty, and audio settings in browser local storage.
- Browse every card and faction in the **codex** (`/codex`), rendered on the server, and jump from it straight into a faction's deck builder.
- Read the game data from a small JSON API (`/api`).

## Requirements

- Node.js 24 (the repository includes an `.nvmrc`).
- npm, included with Node.js.

## Run locally

```sh
nvm use
npm ci
npm run dev
```

Open the local URL printed by Vite. The game (`/`) runs entirely in the browser; the codex (`/codex`) and `/api` are served by the same dev server.

## Available scripts

| Command             | Purpose                                                     |
| ------------------- | ----------------------------------------------------------- |
| `npm run dev`       | Start the Vite development server on the network interface. |
| `npm start`         | Start the Vite development server.                          |
| `npm run typecheck` | Check TypeScript and Angular templates.                     |
| `npm test`          | Run engine, game-store and API tests.                       |
| `npm run build`     | Run type checks and create a production build.              |
| `npm run preview`   | Run the production Nitro server (`dist/analog/server`).     |

## How to play

Choose a faction, review its cards, and adjust your deck. In a match, place units in the row that matches their strength, use special cards and leader abilities when they can swing the score, and decide when to pass. Each round goes to the player with the higher total strength; win two rounds to take the match. The game includes an opening-hand exchange and a graveyard for cards removed from play.

## Project structure

```text
src/app/
  pages/                 Analog file routes: index (client-only game shell), codex (Server Component)
  codex/                 Codex Server Component, its server-only repository and two client islands
  game/
    game.component.ts    The game: provides the store and composes the screens (game.html)
    catalog.ts           Read-only localized views of the game data (shared by codex and API)
    engine.ts            Game rules, scoring, deck validation, and AI
    game.store.ts        Match controller, UI state, settings, and lifecycle
    models.ts            Shared game types
    components/          Battlefield, deck builder, cards, details, portraits, overlay dialog
    motion/              Game-specific motion built on Angular Movement (score bump)
src/server/
  strata/                Strata controllers (catalog, decks) and their input schemas
  plugins/strata.ts      Registers the controllers on Nitro's router, owns the /api namespace
  routes/api/health.get.ts  A native Nitro route inside /api
src/main.server.ts       SSR entry, wrapped in Strata's SSR failure contract
src/styles.css           Imports Tailwind, the Volt theme preset and the partials below
src/styles/              tokens, base, card, menu, faction, deck, prepare, battle, dialogs, result, codex
public/assets/           Faction and card artwork
tests/                   Engine, game-store and API tests
.agentyx/skills/         Project skill for coding agents (installed by Agentyx)
```

The rules engine is kept independent of Angular. The page-level component provides the match store, while focused standalone components render the deck builder, battlefield and dialogs. Angular signals drive view updates; Analog provides file-based routing, SSR and the Nitro server, and Vite handles development and builds.

## UI library integration

Each library owns one concern, and the app does not re-implement what a library already provides.

| Library                                          | Owns                                                                                                                                                                                                                                                                                                                                              | Where                                                                                                                                                                                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Volt UI** (`@voltui/components`, package mode) | Every UI atom: buttons, badges, cards/panels, avatars, dialog, radio groups, switches, slider, toggle group (deck filter), meters (deck rules), alerts, empty states, table, toasts.                                                                                                                                                              | All templates. Theme: `provideVoltTheme` + the `sage-sharp` preset; `src/styles/tokens.css` maps the game palette and each faction onto Volt's semantic tokens (`--primary`, `--surface`, …), so dialogs portalled to `<body>` follow the faction too. |
| **Quartz Headless**                              | Behaviour Volt does not cover: drag & drop from hand to rows (`qzDraggable` / `qzDropZone`), tooltips on icon-only buttons (`qzTooltip`, styled with Volt tokens via `[data-qz-tooltip]`), and the reactive viewport (`ViewportService`), which drives hand/mulligan pagination in the store and decides which panels are rendered at all.        | `battlefield`, `deck-builder`, `index.page`, `game.store.ts`                                                                                                                                                                                           |
| **Angular Movement**                             | Screen entrances, staggered grids (`moveStagger` + `moveInView`), hover/tap feedback (`moveWhileHover="lift"` / `moveWhileTap="press"`), cards entering the board, the turn pulse, and the score/counter bump (`gameBump`, built on the imperative `MoveAnimator`). Reduced motion is honoured automatically.                                     | All screens, `game/motion/bump.directive.ts`                                                                                                                                                                                                           |
| **Strata** (`@strata-sc/*`)                      | The server side: the codex as a Server Component (`@ServerComponent()`, a `server-only` repository, `[strataClient]` islands, `strataDocumentLink` / `strataDocumentNavigationGuard`), the `/api` controllers (`@Controller`, `registerControllers` with `apiBoundary`, Standard Schema validation) and the opt-in SSR failure contract (`/ssr`). | `src/app/codex`, `src/server`, `src/main.server.ts`, `vite.config.ts`                                                                                                                                                                                  |
| **Lumen Icons**                                  | Every UI glyph (settings, navigation, close, pass, archive, weather, rounds won with `variant="filled"`…), imported per icon from `lumen-icons/<name>` for tree-shaking. Card ability and row symbols stay as game artwork.                                                                                                                       | All templates                                                                                                                                                                                                                                          |

Conventions:

- Playing cards are a **domain component** (`button[gameCard]` / `div[gameCard]`), not a Volt button: their face is game artwork and scales with container queries (`src/styles/card.css`).
- Styles never restyle a Volt component's internals. They size or place it, or change tokens.
- Don't hide animated elements with `display: none`. Render them conditionally (`ViewportService.observe(...)`) instead. Angular Movement 1.2 calls `commitStyles()` when an animation finishes, and that throws on elements that are not rendered.
- Volt's MCP server (`.mcp.json`) and skills (`.claude/skills`, `.agents/skills`) are configured for AI agents: `npx @voltui/agent doctor` checks them.

Run `npm test` and `npm run build` after changing the integration. For browser checks, run `npm run dev` and verify settings (keyboard focus, switches, slider), deck filter and meters, card exchange, card placement by click/keyboard/drag, and round continuation on desktop, tablet, phone and landscape phone.

## Server side (Strata)

The game stays client-only: `/` is excluded from SSR (`routeRules` in `vite.config.ts`) and its page only mounts the game in the browser, so it plays the same with or without a server. Everything server-side is additive.

**Codex (`/codex?lang=es|uk|en`).** A Strata Server Component renders every faction and card from `catalog.ts` on the server. `CodexRepository` is marked `server-only`, so the build fails if browser code ever imports it; the browser receives a ~17 KB chunk with a generated surrogate and two client islands:

- `duel-codex-language`, a Volt toggle group that stores the language for the game and reloads the codex in it;
- `duel-codex-play`, one per faction, which opens `/?faction=…&lang=…`. The game handles that link with its own `lang` and `faction` actions and lands in the deck builder.

Links between the game and the codex are document navigations (`strataDocumentLink`, `StrataDocumentNavigator`); the codex route has `strataDocumentNavigationGuard`.

**Game-data API.** Controllers in `src/server/strata`, registered in `src/server/plugins/strata.ts`. `/api` is an owned namespace: unknown paths answer JSON `404`, wrong methods `405` with `Allow`, `HEAD` is derived from `GET`.

| Route                             | Answer                                                                                         |
| --------------------------------- | ---------------------------------------------------------------------------------------------- |
| `GET /api/health`                 | `{ status: "ok" }` (native Nitro route)                                                        |
| `GET /api/factions?lang=`         | Every faction: name, description, trait, leader, card count                                    |
| `GET /api/factions/:id?lang=`     | One faction with its playable cards; `404 faction_not_found`                                   |
| `GET /api/cards?faction=&lang=`   | Cards, optionally for one faction; `400` on an unknown faction or language                     |
| `GET /api/cards/:id?lang=`        | One card; `404 card_not_found`                                                                 |
| `GET /api/decks/starter/:faction` | The recommended deck and its counts                                                            |
| `POST /api/decks/validate`        | Body `{ faction, cards: { [id]: copies } }` → counts and `valid`, using the engine's own rules |

`lang` defaults to `en`. Inputs are checked with small hand-written Standard Schema v1 schemas (`src/server/strata/inputs.ts`); errors are Strata's safe JSON (`{ "error": "…" }`, `no-store`).

**SSR failure contract.** `main.server.ts` and `app.config.server.ts` use `@strata-sc/server-components/ssr`: an unexpected render error answers a generic HTTP 500 instead of a broken page with status 200.

Strata is experimental and pre-1.0. Its qualified tuple is Angular 22.2.3 / Analog 2.7.2 / Vite 8.3.0; this project runs Angular 22.2.5, Analog 2.9.6 and Vite 8.3.8, so it also dogfoods a slightly newer stack. Strata packages are pinned to exact versions.

## Coding agents (Agentyx)

`.agentyx.json` configures the agent harness with [Agentyx](https://github.com/Andersseen/agentyx): the `technical`, `typescript`, `angular`, `ui-ux`, `accessibility`, `testing` and `efficiency` packs, Playwright for rendered checks, and a project pack, `duel`, whose skill (`.agentyx/skills/duel-library-integration`) documents how this repository uses each library. Agentyx installs the skills into `.claude/skills` and `.agents/skills` and the MCP servers into `.mcp.json` and `.codex/config.toml`, next to Volt's own MCP server and skills.

```sh
npx agentyx doctor      # health of the harness
npx agentyx install     # after changing .agentyx.json or a project skill
```

## Build and deploy

```sh
npm run build
npm run preview         # node dist/analog/server/index.mjs (PORT=3000 by default)
```

The build produces a Nitro `node-server` app in `dist/analog`: static assets in `dist/analog/public` and the server in `dist/analog/server`. Deploy it to any Node 22+ host. For Cloudflare Pages, build with `BUILD_PRESET=cloudflare-pages npm run build` (the preset Strata qualifies; not exercised in this repository yet). The game itself has no server dependency; the server is needed for `/codex` and `/api`.

## Notes

- Match state exists only in memory and resets when the page reloads. Decks and preferences are saved in local storage on the current browser.
- `.npmrc` sets `legacy-peer-deps=true` because Quartz Headless and Lumen Icons still declare `@angular/core ^21` as their peer range. The flag also hides _missing_ peers, so required peers are listed explicitly in `package.json` (`@angular/forms` for Volt/ng-primitives, `front-matter` for `@analogjs/content`). Remove the flag once those peer ranges include Angular 22.
- The game uses Angular, Analog, Tailwind CSS, Volt UI, Quartz Headless, Angular Movement and Lumen Icons. See `package.json` for the complete dependency list.
