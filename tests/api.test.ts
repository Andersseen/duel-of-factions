// Runs with the server tsconfig (standard decorators): see the "test" script.
import assert from "node:assert/strict";

import {
  StrataAnalogHttpError,
  type StrataAnalogRequest,
} from "@strata-sc/analog";
import type { StandardSchemaV1 } from "@standard-schema/spec";

import {
  factionCards,
  factions,
  findCard,
  LANGS,
  starterDeck,
} from "../src/app/game/catalog";
import * as E from "../src/app/game/engine";
import { T } from "../src/app/game/translations";
import { CatalogController } from "../src/server/strata/catalog.controller";
import { DecksController } from "../src/server/strata/decks.controller";

/** A request double with Strata's validation contract: schema issues reject. */
function request(init: {
  params?: Record<string, string>;
  query?: Record<string, string>;
  body?: unknown;
}): StrataAnalogRequest {
  const run = async (schema: StandardSchemaV1, value: unknown) => {
    const result = await schema["~standard"].validate(value);
    if (result.issues) throw new Error("invalid_request");
    return result.value;
  };
  return {
    params: init.params ?? {},
    query: init.query ?? {},
    validateQuery: (schema: StandardSchemaV1) => run(schema, init.query ?? {}),
    readValidatedJson: (schema: StandardSchemaV1) => run(schema, init.body),
  } as unknown as StrataAnalogRequest;
}

const rejectsWith = async (
  promise: Promise<unknown> | (() => unknown),
  code: string,
) => {
  try {
    await (typeof promise === "function" ? promise() : promise);
  } catch (error) {
    const actual =
      error instanceof StrataAnalogHttpError
        ? error.code
        : (error as Error).message;
    assert.equal(actual, code);
    return;
  }
  assert.fail(`expected ${code}`);
};

// Catalogue: every card of the engine is reachable, in every language.
for (const lang of LANGS) {
  assert.equal(factions(lang).length, E.FACTIONS.length);
  for (const id of Object.keys(E.cards)) {
    const card = findCard(id, lang)!;
    assert.ok(
      card.name && card.abilityName && card.abilityText,
      `${lang}:${id}`,
    );
  }
}
assert.equal(
  findCard("forest-fox", "es")!.name,
  E.cards["forest-fox"]!.name[0],
);
for (const faction of E.FACTIONS) {
  assert.equal(starterDeck(faction).valid, true, `starter ${faction}`);
  assert.deepEqual(
    factionCards(faction, "en").map((card) => card.id),
    E.available(faction).map((card) => card.id),
  );
}

// Controllers.
const catalog = new CatalogController();
assert.equal(
  (await catalog.listFactions(request({ query: { lang: "uk" } })))[0]!.name,
  T["forest"]![1],
);
assert.equal(
  (await catalog.getFaction(request({ params: { id: "sun" } }))).cards.length,
  E.available("sun").length,
);
await rejectsWith(
  catalog.getFaction(request({ params: { id: "nope" } })),
  "faction_not_found",
);
await rejectsWith(
  catalog.getCard(request({ params: { id: "nope" } })),
  "card_not_found",
);
await rejectsWith(
  catalog.listCards(request({ query: { lang: "xx" } })),
  "invalid_request",
);
await rejectsWith(
  catalog.listCards(request({ query: { faction: "nope" } })),
  "invalid_request",
);
assert.equal(
  (await catalog.listCards(request({}))).length,
  Object.keys(E.cards).length,
);

const decks = new DecksController();
assert.deepEqual(
  decks.starter(request({ params: { faction: "tides" } })).cards,
  E.starter("tides"),
);
await rejectsWith(
  () => decks.starter(request({ params: { faction: "nope" } })),
  "faction_not_found",
);
const verdict = await decks.validate(
  request({ body: { faction: "granite", cards: E.starter("granite") } }),
);
assert.deepEqual(
  { units: verdict.units, special: verdict.special, valid: verdict.valid },
  E.validate(E.starter("granite"), "granite"),
);
assert.equal(
  (
    await decks.validate(
      request({ body: { faction: "forest", cards: { "forest-fox": 3 } } }),
    )
  ).valid,
  false,
);
await rejectsWith(
  decks.validate(request({ body: { faction: "forest", cards: { ghost: 1 } } })),
  "invalid_request",
);
await rejectsWith(
  decks.validate(
    request({ body: { faction: "forest", cards: { frost: -1 } } }),
  ),
  "invalid_request",
);
await rejectsWith(decks.validate(request({ body: [] })), "invalid_request");

console.log(
  "PASS: catalogue in 3 languages, controllers for factions, cards, starter decks and deck validation (incl. 404 and invalid input).",
);
