import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import {
  MoveAnimateDirective,
  MoveHoverDirective,
  MoveTapDirective,
} from "angular-movement";
import { CardComponent } from "../game/components/card.component";
import { BattlefieldComponent } from "../game/components/battlefield.component";
import { DeckBuilderComponent } from "../game/components/deck-builder.component";
import { OverlayComponent } from "../game/components/overlay.component";
import { PortraitComponent } from "../game/components/portrait.component";
import { GameStore } from "../game/game.store";
import { VoltBadge, VoltNativeButton } from "@voltui/components";
@Component({
  selector: "app-game",
  providers: [GameStore],
  imports: [
    CardComponent,
    PortraitComponent,
    BattlefieldComponent,
    DeckBuilderComponent,
    OverlayComponent,
    MoveAnimateDirective,
    MoveHoverDirective,
    MoveTapDirective,
    VoltNativeButton,
    VoltBadge,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./game.html",
})
export default class GamePage {
  readonly c = inject(GameStore).controller;
  act(action: string, data: Record<string, string | number> = {}) {
    this.c.action(
      action,
      Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
    );
  }
}
