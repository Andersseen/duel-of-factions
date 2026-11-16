import { isPlatformBrowser } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  PLATFORM_ID,
} from "@angular/core";

import { GameComponent } from "../game/game.component";

/**
 * Route `/`. The game is a client-only app: `routeRules` already skip SSR for this path, and
 * the shell renders nothing on the server anyway, so no server render can ever reach the game.
 */
@Component({
  selector: "duel-game-page",
  imports: [GameComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ":host{display:contents}",
  template: `@if (browser) {
    <duel-game />
  }`,
})
export default class GamePage {
  protected readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
}
