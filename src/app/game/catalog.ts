/**
 * Public, read-only views of the game data, built from the rules engine and the translations.
 *
 * Framework-free and side-effect free: the Strata controllers (`/api`) and the codex Server
 * Component both read the game through this module, so the engine stays the single source of
 * truth and no rule is duplicated on the server.
 */
import * as E from "./engine";
import type { CardDefinition, Deck } from "./models";
import { AB, rowIcon, symbols, T } from "./translations";

export const LANGS = ["es", "uk", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const isLang = (value: unknown): value is Lang =>
  typeof value === "string" && (LANGS as readonly string[]).includes(value);
export const isFaction = (value: unknown): value is string =>
  typeof value === "string" && E.FACTIONS.includes(value);

/** The store keeps the language as an index into `LANGS`. */
export const langIndex = (lang: Lang): number => LANGS.indexOf(lang);

const EMBLEMS: Readonly<Record<string, string>> = {
  forest: "❧",
  granite: "❖",
  tides: "≈",
  sun: "☀",
};

export interface FactionView {
  readonly id: string;
  readonly emblem: string;
  readonly name: string;
  readonly description: string;
  readonly trait: string;
  readonly leader: {
    readonly name: string;
    readonly ability: string;
    readonly art: number;
  };
  readonly cardCount: number;
}

export interface CardView {
  readonly id: string;
  readonly faction: string;
  readonly name: string;
  readonly unit: boolean;
  readonly hero: boolean;
  readonly power: number;
  readonly row: string;
  readonly rowLabel: string;
  readonly rowSymbol: string;
  readonly ability: string;
  readonly abilityName: string;
  readonly abilityText: string;
  readonly abilitySymbol: string;
  readonly maxCopies: number;
  /** Portrait index for the sprite sheets; negative for special cards drawn with a symbol. */
  readonly art: number;
}

export interface DeckView {
  readonly faction: string;
  readonly cards: Readonly<Deck>;
  readonly units: number;
  readonly special: number;
  readonly valid: boolean;
  readonly rules: { readonly minUnits: number; readonly maxSpecial: number };
}

const text = (key: string, lang: Lang): string =>
  T[key]?.[langIndex(lang)] ?? key;

export function cardView(card: CardDefinition, lang: Lang): CardView {
  const i = langIndex(lang);
  const ability = AB[card.ability] ?? AB[""]!;
  return {
    id: card.id,
    faction: card.f,
    name: card.name[i] ?? card.name[0]!,
    unit: card.unit,
    hero: card.ability === "hero",
    power: card.power,
    row: card.row,
    rowLabel: card.unit ? text(card.row, lang) : text("special", lang),
    rowSymbol: rowIcon[card.row] ?? "",
    ability: card.ability,
    abilityName: ability[i] ?? "",
    abilityText: ability[i + 3] ?? "",
    abilitySymbol: symbols[card.ability] ?? "",
    maxCopies: card.max,
    art: card.art,
  };
}

export function factionView(faction: string, lang: Lang): FactionView {
  return {
    id: faction,
    emblem: EMBLEMS[faction] ?? "",
    name: text(faction, lang),
    description: text(`${faction}Desc`, lang),
    trait: text(`${faction}Trait`, lang),
    leader: {
      name: text(`${faction}Leader`, lang),
      ability: text(`${faction}LeaderDesc`, lang),
      art: E.LEADER_ART[faction] ?? 0,
    },
    cardCount: E.available(faction).length,
  };
}

export const factions = (lang: Lang): FactionView[] =>
  E.FACTIONS.map((faction) => factionView(faction, lang));

/** Every card a faction can put in a deck (its own and the neutrals), in engine order. */
export const factionCards = (faction: string, lang: Lang): CardView[] =>
  E.available(faction).map((card) => cardView(card, lang));

export function findCard(id: string, lang: Lang): CardView | undefined {
  const card = E.cards[id];
  return card ? cardView(card, lang) : undefined;
}

export function deckView(faction: string, cards: Readonly<Deck>): DeckView {
  const result = E.validate({ ...cards }, faction);
  return {
    faction,
    cards,
    units: result.units,
    special: result.special,
    valid: result.valid,
    rules: { minUnits: E.MIN_UNITS, maxSpecial: E.MAX_SPECIAL },
  };
}

export const starterDeck = (faction: string): DeckView =>
  deckView(faction, E.starter(faction));

/** Interface copy the codex needs, resolved for one language. */
export const label = (key: string, lang: Lang): string => text(key, lang);
