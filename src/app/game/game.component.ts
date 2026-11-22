import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { StrataDocumentLink } from "@strata-sc/server-components/navigation";
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
import { LmnBookOpenIcon } from "lumen-icons/book-open";
import { LmnChevronLeftIcon } from "lumen-icons/chevron-left";
import { LmnChevronRightIcon } from "lumen-icons/chevron-right";
import { LmnFlagIcon } from "lumen-icons/flag";
import { LmnHomeIcon } from "lumen-icons/home";
import { LmnQuestionMarkCircleIcon } from "lumen-icons/question-mark-circle";
import { LmnScaleIcon } from "lumen-icons/scale";
import { LmnSettingsIcon } from "lumen-icons/settings";
import { LmnSquares2x2Icon } from "lumen-icons/squares-2x2";
import { LmnTrophyIcon } from "lumen-icons/trophy";
import { BattlefieldComponent } from "./components/battlefield.component";
import { CardComponent } from "./components/card.component";
import { DeckBuilderComponent } from "./components/deck-builder.component";
import { OverlayComponent } from "./components/overlay.component";
import {
  PortraitComponent,
  warmPortraitSheets,
} from "./components/portrait.component";
import { isFaction, isLang, langIndex, LANGS } from "./catalog";
import { GameStore } from "./game.store";
import { BumpDirective } from "./motion/bump.directive";

/**
 * The game: provides one `GameStore` per visit and composes the screens around it. Browser
 * only (it reads window and localStorage on start); the `/` route mounts it after hydration.
 */
@Component({
  selector: "duel-game",
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
    LmnBookOpenIcon,
    StrataDocumentLink,
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
export class GameComponent {
  readonly c = inject(GameStore).controller;
  /** The menu artwork is dropped (not hidden) on very short phone screens. */
  readonly showMenuArt = inject(ViewportService).observe(
    "(min-width: 701px), (min-height: 601px)",
  );

  constructor() {
    this.#applyDeepLink();
    warmPortraitSheets();
  }

  /** Language code for links that leave the game (the store keeps an index). */
  langCode() {
    return LANGS[this.c.lang] ?? "en";
  }

  /**
   * `/?faction=forest&lang=uk` (used by the codex) opens that faction's deck builder in that
   * language, through the store's own actions. The query is then dropped from the URL so a
   * reload returns to the menu.
   */
  #applyDeepLink() {
    const query = inject(ActivatedRoute).snapshot.queryParamMap;
    const lang = query.get("lang");
    const faction = query.get("faction");
    if (!lang && !faction) return;
    if (isLang(lang)) this.act("lang", { lang: langIndex(lang) });
    if (isFaction(faction)) this.act("faction", { faction });
    inject(Location).replaceState("/");
  }

  act(action: string, data: Record<string, string | number> = {}) {
    this.c.action(
      action,
      Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
    );
  }
}
