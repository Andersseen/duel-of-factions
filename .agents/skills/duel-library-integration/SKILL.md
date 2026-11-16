---
name: duel-library-integration
description: How Duel of Factions uses its own libraries (Volt UI, Quartz Headless, Angular Movement, Lumen Icons, Strata). Use before adding or changing UI, motion, icons, tooltips, drag and drop, viewport logic, server routes, APIs or Server Components here, or when one of those libraries seems to misbehave.
---

# Duel of Factions: library integration

This game exists to **dogfood the author's own libraries**. A change is done when it uses the right
library for the job, through its documented API, and when every library defect it hits is written
down rather than patched around silently.

## Who owns what

| Concern | Owner | Notes |
| --- | --- | --- |
| UI atoms: buttons, badges, panels, avatars, dialog, radios, switch, slider, toggle group, meter, alert, empty state, table, toast | **Volt UI** (`@voltui/components`, package mode, `Volt*` / `volt-*`) | Exact APIs come from the `volt-ui` MCP server (`get_component`, `get_usage_example`). Never invent an input. |
| Behaviour Volt does not cover: drag & drop, text tooltips, reactive viewport | **Quartz Headless** (`qzDraggable`, `qzDropZone`, `qzTooltip`, `ViewportService`) | Tooltips are styled in `src/styles/base.css` via `[data-qz-tooltip]` with Volt tokens. |
| Motion | **Angular Movement** | `move`, `moveInView` + `moveStagger`, `moveWhileHover="lift"` + `moveWhileTap="press"`, `moveLoop`; imperative motion through `MoveAnimator` (see `game/motion/bump.directive.ts`). |
| UI glyphs | **Lumen Icons** | Import per icon: `import { LmnXMarkIcon } from "lumen-icons/x-mark"`. Sizes are `12 · 14 · 16 · 20 · 24 · 32` and must be bound: `[size]="16"`. Card ability / row symbols are game artwork, not UI icons. |
| HTTP API and server-rendered pages | **Strata** (`@strata-sc/core`, `@strata-sc/analog`, `@strata-sc/server-components`) | Controllers in `src/server/strata`, registered in `src/server/plugins/strata.ts` with `apiBoundary`; the codex (`src/app/codex`) is the only Server Component route. |

## Rules

- **Playing cards are domain components** (`button[gameCard]` / `div[gameCard]`), not Volt buttons.
  Their typography scales with container queries in `src/styles/card.css`; contexts only set size.
- **Styles never restyle a Volt component's internals.** Use variants and sizes first, then tokens
  (`src/styles/tokens.css` maps the game and faction palette onto Volt's semantic tokens), then
  `class` on the component, then a layout wrapper.
- **Never hide an animated element with `display: none`.** Render it conditionally with
  `inject(ViewportService).observe("(min-width: …)")`. Movement's `commitStyles()` throws on
  non-rendered elements.
- **Don't put `move*` on an element that Volt positions with `translate`** (the dialog content).
  Volt already animates its dialog.
- **Icon-only buttons** need `[attr.aria-label]` and a `qzTooltip` with the same text. Disable the
  tooltip (`tooltipDisabled`) when the button opens a dialog, because Quartz keeps it open after a click.
- **The rules engine (`game/engine.ts`) stays framework-free** and is the single source of truth for
  both the client and the Strata controllers. Never duplicate a rule in a controller.
- **The game itself must keep working with no server**: it is playable offline and does not
  call `/api`. Server features are additive (public API, codex page).
- **`/` is client-only.** It is excluded from SSR in `vite.config.ts` and its page mounts the game
  only in the browser. Never add SSR-only assumptions to the game; never import the store from server code.
- **Server Component composition rules:** composed local components need a single custom
  element selector (use `game-portrait`, not `[gamePortrait]`) and a literal template or a relative
  `templateUrl`. No `(event)` bindings in server-owned templates: interaction goes in a
  `[strataClient]` island. Bind island inputs *and* repeat them in `[strataClient]`.
- **Links into `/codex` are document navigations** (`strataDocumentLink`, `StrataDocumentNavigator`),
  never `routerLink`.
- **Controllers use standard decorators.** They are type-checked by `tsconfig.server.json` and are
  excluded from the Angular program (`tsconfig.app.json`). API tests run with
  `TSX_TSCONFIG_PATH=tsconfig.server.json`.
- **Server-only modules** start with `import "@strata-sc/server-components/server-only";`. Islands
  receive only flat DTOs; never pass engine objects or repositories to a `[strataClient]` boundary.

## Verifying a change

1. `npm run typecheck && npm test && npm run build`.
2. Run the game in a real browser (Playwright) at 1440×900, 1024×768, 1280×720, 390×844, 360×640
   and 844×390, through menu → faction → deck → mulligan → battle → round → result, with the
   console clean (no errors or warnings).
3. For server work, also `curl` the API routes against `npm run preview` and check status codes,
   `content-type` and the JSON shape; confirm the browser chunks in `dist/analog/public/assets`
   contain no server-only code (e.g. `grep -l CodexRepository` finds nothing there).

## When a library misbehaves

Do not patch `node_modules`. Work around it in the app (one line, with a comment naming the
defect), then record it with file and line in the final report so the author can fix it upstream.
