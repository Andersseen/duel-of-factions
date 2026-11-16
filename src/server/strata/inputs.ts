import { isFaction, isLang, type Lang } from "../../app/game/catalog";
import * as E from "../../app/game/engine";
import type { Deck } from "../../app/game/models";

import { isRecord, schema } from "./schema";

/** `?lang=es|uk|en`, English by default. Unknown query keys are ignored. */
export const langQuery = schema<{ lang: Lang }>((value) => {
  const lang = isRecord(value) ? value["lang"] : undefined;
  if (lang === undefined) return { lang: "en" };
  return isLang(lang) ? { lang } : ["lang must be one of es, uk, en"];
});

/** `?faction=…&lang=…` for the card list. */
export const cardsQuery = schema<{ lang: Lang; faction?: string }>((value) => {
  const query = isRecord(value) ? value : {};
  const lang = query["lang"] ?? "en";
  const faction = query["faction"];
  const issues: string[] = [];
  if (!isLang(lang)) issues.push("lang must be one of es, uk, en");
  if (faction !== undefined && !isFaction(faction))
    issues.push("unknown faction");
  if (issues.length) return issues;
  return faction === undefined
    ? { lang: lang as Lang }
    : { lang: lang as Lang, faction: faction as string };
});

const MAX_DECK_ENTRIES = 64;

/** Body of `POST /api/decks/validate`: `{ faction, cards: { [cardId]: copies } }`. */
export const deckBody = schema<{ faction: string; cards: Deck }>((value) => {
  if (!isRecord(value)) return ["body must be an object"];
  const { faction, cards } = value;
  if (!isFaction(faction)) return ["unknown faction"];
  if (!isRecord(cards)) return ["cards must be an object"];
  const entries = Object.entries(cards);
  if (entries.length > MAX_DECK_ENTRIES) return ["too many card entries"];
  const deck: Deck = {};
  for (const [id, copies] of entries) {
    if (!E.cards[id]) return [`unknown card ${id}`];
    if (!Number.isInteger(copies) || (copies as number) < 0)
      return ["copies must be non-negative integers"];
    deck[id] = copies as number;
  }
  return { faction, cards: deck };
});
