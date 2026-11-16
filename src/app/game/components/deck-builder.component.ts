import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TooltipDirective } from "@quartz-headless/primitives";
import {
  VoltAlert,
  VoltAlertDescription,
  VoltAvatar,
  VoltCard,
  VoltMeter,
  VoltMeterIndicator,
  VoltMeterLabel,
  VoltMeterTrack,
  VoltMeterValue,
  VoltNativeButton,
  VoltToggleGroup,
  VoltToggleGroupItem,
} from "@voltui/components";
import {
  MoveAnimateDirective,
  MoveHoverDirective,
  MoveInViewDirective,
  MoveTapDirective,
} from "angular-movement";
import { LmnArrowLeftIcon } from "lumen-icons/arrow-left";
import { LmnArrowRightIcon } from "lumen-icons/arrow-right";
import { LmnExclamationTriangleIcon } from "lumen-icons/exclamation-triangle";
import { LmnMinusIcon } from "lumen-icons/minus";
import { LmnPlusIcon } from "lumen-icons/plus";
import { LmnQuestionMarkCircleIcon } from "lumen-icons/question-mark-circle";
import { GameStore } from "../game.store";
import { BumpDirective } from "../motion/bump.directive";
import { CardComponent } from "./card.component";
import { DetailComponent } from "./detail.component";
import { PortraitComponent } from "./portrait.component";

@Component({
  selector: "game-deck-builder",
  imports: [
    CardComponent,
    DetailComponent,
    PortraitComponent,
    BumpDirective,
    TooltipDirective,
    VoltAlert,
    VoltAlertDescription,
    VoltAvatar,
    VoltCard,
    VoltMeter,
    VoltMeterIndicator,
    VoltMeterLabel,
    VoltMeterTrack,
    VoltMeterValue,
    VoltNativeButton,
    VoltToggleGroup,
    VoltToggleGroupItem,
    MoveAnimateDirective,
    MoveHoverDirective,
    MoveInViewDirective,
    MoveTapDirective,
    LmnArrowLeftIcon,
    LmnArrowRightIcon,
    LmnExclamationTriangleIcon,
    LmnMinusIcon,
    LmnPlusIcon,
    LmnQuestionMarkCircleIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./deck-builder.html",
})
export class DeckBuilderComponent {
  readonly c = inject(GameStore).controller;

  act(action: string, data: Record<string, string | number> = {}) {
    this.c.action(
      action,
      Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, String(value)]),
      ),
    );
  }

  /** Toggle group emits the selected values; a single-select filter always has one. */
  filter(value: string[]) {
    if (value[0]) this.c.setFilter(value[0]);
  }
}
