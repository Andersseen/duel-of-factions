import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import {
  MoveAnimateDirective,
  MoveHoverDirective,
  MoveTapDirective,
} from "angular-movement";
import { VoltNativeButton } from "@voltui/components";
import { CardComponent } from "./card.component";
import { DetailComponent } from "./detail.component";
import { PortraitComponent } from "./portrait.component";
import { GameStore } from "../game.store";

@Component({
  selector: "game-deck-builder",
  imports: [
    CardComponent,
    DetailComponent,
    PortraitComponent,
    MoveAnimateDirective,
    MoveHoverDirective,
    MoveTapDirective,
    VoltNativeButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./deck-builder.html",
})
export class DeckBuilderComponent {
  readonly c = inject(GameStore).controller;

  act(action: string, data: Record<string, string | number> = {}) {
    this.c.action(
      action,
      Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value)])),
    );
  }

  select(event: Event) {
    this.c.setFilter((event.target as HTMLSelectElement).value);
  }
}
