import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideFileRouter } from "@analogjs/router";
import { provideMovement } from "angular-movement";
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideFileRouter(),
    provideMovement({
      duration: 220,
      easing: "ease-out",
      disabled: false,
    }),
  ],
};
