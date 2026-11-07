import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { GameStore } from "../game/game.store";
import { CardComponent } from "./card.component";
import { DetailComponent } from "./detail.component";
@Component({
  selector: "game-overlay",
  imports: [CardComponent, DetailComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ":host{display:contents}",
  templateUrl: "./overlay.html",
})
export class OverlayComponent {
  readonly c = inject(GameStore).controller;
  act(action: string, data: Record<string, string | number> = {}) {
    this.c.action(
      action,
      Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
    );
  }
  volume(event: Event) {
    this.c.setVolume((event.target as HTMLInputElement).value);
  }
}
