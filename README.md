# Duelo de Facciones — Angular + Analog.js

A native Angular migration of the original single-player card game. The original illustrations, responsive layouts, four factions, three languages (Spanish, English and Ukrainian), deck builder, difficulty levels, local AI and procedural audio are retained.

## Run locally

Use Node.js 24 (see `.nvmrc`). Install the locked dependencies and start Vite:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. No API keys, database or backend services are required.

```sh
npm test          # Engine simulations and controller integration tests
npm run typecheck # Strict TypeScript and Angular template checks
npm run build     # Type checks and production bundle
npm run preview   # Serve the production build locally
```

## Architecture

- Angular 22.2.5, Analog.js 2.9.6, TypeScript 6 and Vite 7.
- Standalone components, OnPush change detection, zoneless bootstrap, signal-based view invalidation, functional inputs and native Angular template control flow.
- `src/app/pages/index.page.ts`: Analog file-based route.
- `src/app/pages/game.html`: menu, faction selection, deck builder, preparation, battle and results.
- `src/app/game/engine.ts`: typed game rules and AI, independent of Angular.
- `src/app/game/models.ts`: shared game types.
- `src/app/game/game.store.ts`: Angular service and game controller, settings and lifecycle cleanup. The original mutable engine is retained; signals notify Angular when its state changes.
- `src/app/game/audio.ts`: procedural Web Audio music and effects. Audio starts after user interaction; there are no separate music files.
- `src/app/game/translations.ts` and `i18n.ts`: original translation catalogs and helpers.
- `src/app/game/components/`: game card, portrait, details and overlay components.
- `@voltui/components`: Volt UI button and badge components imported directly from the package.
- `src/styles.css`: original visual design and responsive behavior, with Tailwind CSS v4 utilities and theme tokens for Volt UI atoms.
- `public/assets/`: original illustration atlases, rendered as SVG crops.
- `tests/`: game-rule simulations and controller integration coverage.

This is a client-rendered Analog application (`ssr: false`), matching the original local game. It does not implement server rendering, server components or a multiplayer backend. The UI is rendered through Angular templates, not an embedded legacy HTML application. Browser APIs are used for audio, local settings and pointer dragging.

## Behavior and data

Settings and custom decks are stored in localStorage using the original `df-*` keys. An active match is in memory and resets on page reload. Difficulty changes apply to the next match. Mobile uses paginated hands; desktop shows all ten initial cards in two rows. Artwork and faction colors are unchanged. Quartz Headless handles drag-and-drop, modal behavior and toast notifications; Angular Movement handles screen, hover, tap and turn-indicator motion. Tailwind CSS v4 provides utility styling and design tokens without adding SCSS.

Volt UI's native button directive and badge component are imported directly from `@voltui/components` and themed to the existing forest-and-gold palette. Quartz Headless supplies accessible dialog focus, dismissal, background isolation, drag-and-drop and toasts. Angular Movement handles screen entry and interaction motion, replacing the UI's hand-written transitions and keyframes. Tailwind CSS v4 is configured through PostCSS; the established game layout remains intact.

Quartz Headless 0.16 currently declares Angular 21 peer dependencies while this app runs Angular 22. `.npmrc` keeps clean installs reproducible with that peer-range mismatch; the app type-checks and builds with the installed version, but Quartz's upstream Angular 22 support is not yet declared.

## Build and delivery

The production client is emitted to `dist/client`; Analog also creates its output under `dist/analog`. For a static host, serve the contents of `dist/client` and configure an index.html fallback if you add routes. Assets use root-relative paths, so the default configuration expects deployment at the domain root.

This archive contains source code, assets, tests and the dependency lockfile. Generated output and node_modules are excluded. The previously published prototype is not changed by this export.

## Validation

The migration passes strict TypeScript/template checking, a production build, 438 simulated AI matches, game-rule checks and controller tests covering responsive hand sizes, faction themes, mulligans, settings, match difficulty and cleanup. Browser smoke checks cover desktop play and the mobile interface. These checks are not a guarantee of every possible visual or audio interaction on every device.
