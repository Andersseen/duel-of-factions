import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideFileRouter } from "@analogjs/router";
export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection(), provideFileRouter()],
};
