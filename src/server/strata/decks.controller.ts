import {
  StrataAnalogHttpError,
  type StrataAnalogRequest,
} from "@strata-sc/analog";
import { Controller, Get, Post } from "@strata-sc/core";

import {
  deckView,
  isFaction,
  starterDeck,
  type DeckView,
} from "../../app/game/catalog";

import { deckBody } from "./inputs";

/** Deck rules as a service: the recommended deck and validation with the engine's own rules. */
@Controller("/api/decks")
export class DecksController {
  @Get("/starter/:faction")
  starter(request: StrataAnalogRequest): DeckView {
    const faction = request.params["faction"];
    if (!isFaction(faction))
      throw new StrataAnalogHttpError(404, "faction_not_found");
    return starterDeck(faction);
  }

  /** Stateless and side-effect free: it answers whether a deck is legal, it stores nothing. */
  @Post("/validate")
  async validate(request: StrataAnalogRequest): Promise<DeckView> {
    const { faction, cards } = await request.readValidatedJson(deckBody);
    return deckView(faction, cards);
  }
}
