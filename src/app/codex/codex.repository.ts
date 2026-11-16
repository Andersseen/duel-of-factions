// Asserted server-only: the build fails if any browser code reaches this module, so the
// catalogue builder, the engine data it walks and the translations stay on the server here.
import "@strata-sc/server-components/server-only";

import { Injectable } from "@angular/core";
import { injectRequest } from "@analogjs/router/tokens";

import {
  factionCards,
  factions,
  isLang,
  label,
  LANGS,
  starterDeck,
  type CardView,
  type FactionView,
  type Lang,
} from "../game/catalog";

export interface CodexFaction {
  readonly faction: FactionView;
  readonly cards: readonly CardView[];
  readonly starter: { readonly units: number; readonly special: number };
}

export interface CodexView {
  readonly lang: Lang;
  readonly languages: readonly {
    readonly code: Lang;
    readonly label: string;
  }[];
  readonly text: Readonly<Record<string, string>>;
  readonly factions: readonly CodexFaction[];
  readonly neutral: readonly CardView[];
}

const LANGUAGE_NAMES: Record<Lang, string> = {
  es: "Español",
  uk: "Українська",
  en: "English",
};

const TEXT_KEYS = [
  "codex",
  "codexSub",
  "playFaction",
  "neutralCards",
  "backToGame",
  "language",
  "leader",
  "units",
  "special",
  "cards",
  "copies",
] as const;

/** Builds the codex for the language in the request's `?lang=` (English by default). */
@Injectable({ providedIn: "root" })
export class CodexRepository {
  readonly #request = injectRequest();

  view(): CodexView {
    const lang = this.#lang();
    return {
      lang,
      languages: LANGS.map((code) => ({ code, label: LANGUAGE_NAMES[code] })),
      text: Object.fromEntries(TEXT_KEYS.map((key) => [key, label(key, lang)])),
      factions: factions(lang).map((faction) => {
        const starter = starterDeck(faction.id);
        return {
          faction,
          cards: factionCards(faction.id, lang).filter(
            (card) => card.faction === faction.id,
          ),
          starter: { units: starter.units, special: starter.special },
        };
      }),
      neutral: factionCards("forest", lang).filter(
        (card) => card.faction === "neutral",
      ),
    };
  }

  #lang(): Lang {
    const url = this.#request?.originalUrl ?? this.#request?.url ?? "/";
    const value = new URL(url, "http://codex.local").searchParams.get("lang");
    return isLang(value) ? value : "en";
  }
}
