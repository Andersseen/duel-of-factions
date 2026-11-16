import { defineEventHandler } from "h3";

/** A native Nitro route inside the Strata-owned `/api` namespace (declared in `nativeRoutes`). */
export default defineEventHandler(() => ({ status: "ok" }));
