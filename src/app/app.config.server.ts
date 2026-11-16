import { mergeApplicationConfig, type ApplicationConfig } from "@angular/core";
import { provideClientHydration } from "@angular/platform-browser";
import { provideServerRendering } from "@angular/platform-server";
import { RESPONSE } from "@analogjs/router/tokens";
import { provideStrataSsrFailureHandler } from "@strata-sc/server-components/ssr";

import { appConfig } from "./app.config";

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // Emits the `ngh` annotations and transfer state Strata's client islands hydrate from.
    provideClientHydration(),
    provideStrataSsrFailureHandler(RESPONSE),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
