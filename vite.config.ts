import analog from "@analogjs/platform";
import { strataServerComponents } from "@strata-sc/server-components/vite";
import { defineConfig } from "vite";

// Strata controllers (src/server/**) use standard decorators. Nitro compiles the server code
// itself, outside the Angular program, so they need no extra transform here; type-checking
// uses tsconfig.server.json (experimentalDecorators: false).
export default defineConfig({
  // Required by Analog/Nitro for `@ServerComponent()` decorators (TypeScript `importHelpers`).
  ssr: { noExternal: ["tslib"] },
  plugins: [
    // Before analog(): the browser surrogates must exist when Analog reads its tsconfig.
    strataServerComponents({
      root: import.meta.dirname,
      sourceDir: "src/app",
      generatedDir: "src/generated/server-components",
    }),
    analog({
      ssr: true,
      prerender: { routes: [] },
      nitro: {
        // The game itself stays a client-only app: it reads window and localStorage on start
        // and must keep working without a server. Only the codex is server-rendered.
        routeRules: { "/": { ssr: false } },
      },
    }),
  ],
});
