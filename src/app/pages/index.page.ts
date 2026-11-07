import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { GameStore } from "../game/game.store";
import { CardComponent } from "../ui/card.component";
import { PortraitComponent } from "../ui/portrait.component";
import { DetailComponent } from "../ui/detail.component";
import { DragCardDirective } from "../ui/drag-card.directive";
import { OverlayComponent } from "../ui/overlay.component";
@Component({
  selector: "app-game",
  providers: [GameStore],
  imports: [
    CardComponent,
    PortraitComponent,
    DetailComponent,
    DragCardDirective,
    OverlayComponent,
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
  weathered(row: number) {
    return (
      this.c.game?.weather.some(
        (w) => this.c.E.def(w.card).ability === this.c.E.ROWS[row],
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
  select(event: Event) {
    this.c.setFilter((event.target as HTMLSelectElement).value);
  }
}
