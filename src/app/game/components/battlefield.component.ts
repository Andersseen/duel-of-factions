import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import {
  DraggableDirective,
  DropZoneDirective,
  QzDropInfo,
  ViewportService,
} from "@quartz-headless/core";
import { TooltipDirective } from "@quartz-headless/primitives";
import {
  VoltAvatar,
  VoltBadge,
  VoltCard,
  VoltNativeButton,
} from "@voltui/components";
import {
  MoveAnimateDirective,
  MoveHoverDirective,
  MoveLoopDirective,
  MoveTapDirective,
} from "angular-movement";
import { LmnArchiveBoxIcon } from "lumen-icons/archive-box";
import { LmnChevronLeftIcon } from "lumen-icons/chevron-left";
import { LmnChevronRightIcon } from "lumen-icons/chevron-right";
import { LmnHandRaisedIcon } from "lumen-icons/hand-raised";
import { LmnInformationCircleIcon } from "lumen-icons/information-circle";
import { LmnMegaphoneIcon } from "lumen-icons/megaphone";
import { LmnPlusIcon } from "lumen-icons/plus";
import { LmnRectangleStackIcon } from "lumen-icons/rectangle-stack";
import { LmnSparklesIcon } from "lumen-icons/sparkles";
import { LmnStarIcon } from "lumen-icons/star";
import { LmnSunIcon } from "lumen-icons/sun";
import { LmnXMarkIcon } from "lumen-icons/x-mark";
import { GameStore } from "../game.store";
import { BumpDirective } from "../motion/bump.directive";
import { CardComponent } from "./card.component";
import { DetailComponent } from "./detail.component";
import { PortraitComponent } from "./portrait.component";

/**
 * The match board. Library roles:
 * - Volt: panels, badges, avatars and every UI button.
 * - Quartz: drag & drop from hand to rows (`qzDraggable` / `qzDropZone`) and tooltips.
 * - Movement: enter/hover/tap motion and the score bump (`gameBump` over `MoveAnimator`).
 * - Lumen: every UI glyph.
 */
@Component({
  selector: "game-battlefield",
  imports: [
    CardComponent,
    DetailComponent,
    PortraitComponent,
    BumpDirective,
    DraggableDirective,
    DropZoneDirective,
    TooltipDirective,
    VoltAvatar,
    VoltBadge,
    VoltCard,
    VoltNativeButton,
    MoveAnimateDirective,
    MoveHoverDirective,
    MoveLoopDirective,
    MoveTapDirective,
    LmnArchiveBoxIcon,
    LmnChevronLeftIcon,
    LmnChevronRightIcon,
    LmnHandRaisedIcon,
    LmnInformationCircleIcon,
    LmnMegaphoneIcon,
    LmnPlusIcon,
    LmnRectangleStackIcon,
    LmnSparklesIcon,
    LmnStarIcon,
    LmnSunIcon,
    LmnXMarkIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./battlefield.html",
})
export class BattlefieldComponent {
  readonly c = inject(GameStore).controller;
  /**
   * The inspector column only exists on wide screens. It is not rendered at all below that
   * (rather than hidden with CSS), so its Movement animations never run on detached boxes.
   */
  readonly #viewport = inject(ViewportService);
  readonly showInspector = this.#viewport.observe("(min-width: 1101px)");
  /** The move log needs vertical room as well. */
  readonly showLog = this.#viewport.observe(
    "(min-width: 1101px) and (min-height: 731px)",
  );

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
