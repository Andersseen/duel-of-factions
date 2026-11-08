import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import {
  DraggableDirective,
  DropZoneDirective,
  QzDropInfo,
} from "@quartz-headless/core";
import {
  MoveAnimateDirective,
  MoveLoopDirective,
  MoveHoverDirective,
  MoveTapDirective,
} from "angular-movement";
import { VoltNativeButton } from "@voltui/components";
import { GameStore } from "../game.store";
import { CardComponent } from "./card.component";
import { DetailComponent } from "./detail.component";
import { PortraitComponent } from "./portrait.component";

@Component({
  selector: "game-battlefield",
  imports: [
    CardComponent,
    DetailComponent,
    PortraitComponent,
    MoveAnimateDirective,
    MoveLoopDirective,
    MoveHoverDirective,
    MoveTapDirective,
    DraggableDirective,
    DropZoneDirective,
    VoltNativeButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./battlefield.html",
})
export class BattlefieldComponent {
  readonly c = inject(GameStore).controller;

  act(action: string, data: Record<string, string | number> = {}) {
    this.c.action(
      action,
      Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, String(value)]),
      ),
    );
  }

  weathered(row: number) {
    return (
      this.c.game?.weather.some(
        (weather) => this.c.E.def(weather.card).ability === this.c.E.ROWS[row],
      ) ?? false
    );
  }

  boardCard(event: Event, side: number, row: number, uid: number, id: string) {
    event.stopPropagation();
    const card = { uid, id };
    if (this.c.decoyTarget(side, card)) this.act("decoy-target", { uid });
    else if (this.c.rowValid(side, row)) this.act("row", { row });
    else this.act("board-inspect", { id });
  }

  dragStart(uid: number) {
    this.c.selectDrag(uid);
  }

  activateRow(event: Event, side: number, row: number) {
    // A card's keyboard activation belongs to its native button, not the row.
    if (event.target !== event.currentTarget || !this.c.rowValid(side, row))
      return;
    event.preventDefault();
    this.act("row", { row });
  }

  activateSpecial(event: Event) {
    if (
      event.target !== event.currentTarget ||
      !this.c.special ||
      !this.c.canPlay()
    )
      return;
    event.preventDefault();
    this.act("play-special");
  }

  drop(info: QzDropInfo, row?: number, target?: number) {
    info.event.stopPropagation();
    const data = info.data;
    if (
      typeof data !== "object" ||
      data === null ||
      !("uid" in data) ||
      typeof data.uid !== "number" ||
      !this.c.game?.players[0].hand.some((card) => card.uid === data.uid)
    )
      return;
    if (this.c.selectDrag(data.uid)) this.c.drop(row, target);
  }
}
