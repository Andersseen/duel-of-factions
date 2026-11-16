import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ViewportService } from "@quartz-headless/core";
import { TooltipDirective } from "@quartz-headless/primitives";
import {
  VoltAvatar,
  VoltBadge,
  VoltCard,
  VoltNativeButton,
  VoltTable,
  VoltTableBody,
  VoltTableCell,
  VoltTableHead,
  VoltTableHeader,
  VoltTableRow,
} from "@voltui/components";
import {
  MoveAnimateDirective,
  MoveHoverDirective,
  MoveInViewDirective,
  MoveStaggerDirective,
  MoveTapDirective,
} from "angular-movement";
import { LmnArrowPathIcon } from "lumen-icons/arrow-path";
import { LmnArrowRightIcon } from "lumen-icons/arrow-right";
import { LmnArrowUpRightIcon } from "lumen-icons/arrow-up-right";
import { LmnChevronLeftIcon } from "lumen-icons/chevron-left";
import { LmnChevronRightIcon } from "lumen-icons/chevron-right";
import { LmnFlagIcon } from "lumen-icons/flag";
import { LmnHomeIcon } from "lumen-icons/home";
import { LmnQuestionMarkCircleIcon } from "lumen-icons/question-mark-circle";
import { LmnScaleIcon } from "lumen-icons/scale";
import { LmnSettingsIcon } from "lumen-icons/settings";
import { LmnSquares2x2Icon } from "lumen-icons/squares-2x2";
import { LmnTrophyIcon } from "lumen-icons/trophy";
import { BattlefieldComponent } from "../game/components/battlefield.component";
import { CardComponent } from "../game/components/card.component";
import { DeckBuilderComponent } from "../game/components/deck-builder.component";
import { OverlayComponent } from "../game/components/overlay.component";
import { PortraitComponent } from "../game/components/portrait.component";
import { GameStore } from "../game/game.store";
import { BumpDirective } from "../game/motion/bump.directive";

/**
 * The single route of the game (`/`). Analog's file router maps this page; the page
 * provides one `GameStore` per visit and composes the screens around it.
 */
@Component({
  selector: "app-game",
  providers: [GameStore],
  imports: [
    BattlefieldComponent,
    CardComponent,
    DeckBuilderComponent,
    OverlayComponent,
    PortraitComponent,
    BumpDirective,
    TooltipDirective,
    VoltAvatar,
    VoltBadge,
    VoltCard,
    VoltNativeButton,
    VoltTable,
    VoltTableBody,
    VoltTableCell,
    VoltTableHead,
    VoltTableHeader,
    VoltTableRow,
    MoveAnimateDirective,
    MoveHoverDirective,
    MoveInViewDirective,
    MoveStaggerDirective,
    MoveTapDirective,
    LmnArrowPathIcon,
    LmnArrowRightIcon,
    LmnArrowUpRightIcon,
    LmnChevronLeftIcon,
    LmnChevronRightIcon,
    LmnFlagIcon,
    LmnHomeIcon,
    LmnQuestionMarkCircleIcon,
    LmnScaleIcon,
    LmnSettingsIcon,
    LmnSquares2x2Icon,
    LmnTrophyIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./game.html",
})
export default class GamePage {
  readonly c = inject(GameStore).controller;
  /** The menu artwork is dropped (not hidden) on very short phone screens. */
  readonly showMenuArt = inject(ViewportService).observe(
    "(min-width: 701px), (min-height: 601px)",
  );

  act(action: string, data: Record<string, string | number> = {}) {
    this.c.action(
      action,
      Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
    );
  }
}
