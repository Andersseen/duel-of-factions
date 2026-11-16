import {
  StrataAnalogHttpError,
  type StrataAnalogRequest,
} from "@strata-sc/analog";
import { Controller, Get } from "@strata-sc/core";

import {
  factionCards,
  factions,
  factionView,
  findCard,
  isFaction,
  type CardView,
  type FactionView,
} from "../../app/game/catalog";
import * as E from "../../app/game/engine";

import { cardsQuery, langQuery } from "./inputs";

/**
 * Read-only game data: factions and cards, localised. Everything comes from the same rules
 * engine the browser game runs, through `catalog.ts`.
 */
@Controller("/api")
export class CatalogController {
  @Get("/factions")
  async listFactions(request: StrataAnalogRequest): Promise<FactionView[]> {
    const { lang } = await request.validateQuery(langQuery);
    return factions(lang);
  }

  @Get("/factions/:id")
  async getFaction(
    request: StrataAnalogRequest,
  ): Promise<FactionView & { cards: CardView[] }> {
    const { lang } = await request.validateQuery(langQuery);
    const id = request.params["id"];
    if (!isFaction(id))
      throw new StrataAnalogHttpError(404, "faction_not_found");
    return { ...factionView(id, lang), cards: factionCards(id, lang) };
  }

  @Get("/cards")
  async listCards(request: StrataAnalogRequest): Promise<CardView[]> {
    const { lang, faction } = await request.validateQuery(cardsQuery);
    if (faction) return factionCards(faction, lang);
    return Object.keys(E.cards).map((id) => findCard(id, lang)!);
  }

  @Get("/cards/:id")
  async getCard(request: StrataAnalogRequest): Promise<CardView> {
    const { lang } = await request.validateQuery(langQuery);
    const card = findCard(request.params["id"] ?? "", lang);
    if (!card) throw new StrataAnalogHttpError(404, "card_not_found");
    return card;
  }
}
