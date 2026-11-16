import { registerControllers } from "@strata-sc/analog";
import { defineNitroPlugin } from "nitropack/runtime";

import { CatalogController } from "../strata/catalog.controller";
import { DecksController } from "../strata/decks.controller";

/**
 * Registers the game-data API on Nitro's router. `/api` is an owned API namespace: unknown
 * paths answer JSON 404 and wrong methods 405 with `Allow`, instead of Analog's HTML fallback.
 */
export default defineNitroPlugin((nitroApp) => {
  registerControllers(nitroApp.router, [CatalogController, DecksController], {
    apiBoundary: {
      prefixes: ["/api"],
      nativeRoutes: [{ path: "/api/health", methods: ["GET"] }],
    },
  });
});
