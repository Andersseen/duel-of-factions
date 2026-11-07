import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideFileRouter } from "@analogjs/router";
import { provideMovement } from "angular-movement";
import { provideVoltTheme } from "@voltui/components";
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideFileRouter(),
    provideVoltTheme({ color: "sage", style: "sharp", dark: true }),
    provideMovement({
      duration: 220,
      easing: "ease-out",
      disabled: false,
    }),
  ],
};
