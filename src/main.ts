import { mergeApplicationConfig } from "@angular/core";
import {
  bootstrapApplication,
  provideClientHydration,
} from "@angular/platform-browser";

import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";
import "./styles.css";

// Server-rendered documents (the codex) carry Angular's transfer state and hydrate, which
// Strata's client islands need. The game route is client-only, so it bootstraps normally.
const serverRendered = document.getElementById("ng-state") !== null;

bootstrapApplication(
  AppComponent,
  serverRendered
    ? mergeApplicationConfig(appConfig, {
        providers: [provideClientHydration()],
      })
    : appConfig,
).catch(console.error);
