import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import {
  VoltAlert,
  VoltAlertDescription,
  VoltAvatar,
  VoltBadge,
  VoltCard,
  VoltDialogContent,
  VoltDialogDescription,
  VoltDialogOverlay,
  VoltDialogRoot,
  VoltDialogTitle,
  VoltEmptyState,
  VoltEmptyStateDescription,
  VoltNativeButton,
  VoltRadioGroup,
  VoltRadioItem,
  VoltSlider,
  VoltSwitch,
  VoltToastService,
} from "@voltui/components";
import {
  MoveAnimateDirective,
  MoveHoverDirective,
  MoveTapDirective,
} from "angular-movement";
import { LmnArchiveBoxIcon } from "lumen-icons/archive-box";
import { LmnArrowPathIcon } from "lumen-icons/arrow-path";
import { LmnArrowRightIcon } from "lumen-icons/arrow-right";
import { LmnArrowsPointingInIcon } from "lumen-icons/arrows-pointing-in";
import { LmnArrowsPointingOutIcon } from "lumen-icons/arrows-pointing-out";
import { LmnBookOpenIcon } from "lumen-icons/book-open";
import { LmnHandRaisedIcon } from "lumen-icons/hand-raised";
import { LmnHomeIcon } from "lumen-icons/home";
import { LmnInformationCircleIcon } from "lumen-icons/information-circle";
import { LmnMusicalNoteIcon } from "lumen-icons/musical-note";
import { LmnSpeakerWaveIcon } from "lumen-icons/speaker-wave";
import { LmnXMarkIcon } from "lumen-icons/x-mark";
import { GameStore } from "../game.store";
import { CardComponent } from "./card.component";
import { DetailComponent } from "./detail.component";
import { PortraitComponent } from "./portrait.component";

/** Everything the single game dialog can show, derived from the store. */
export type DialogKind =
  | "settings"
  | "deck-help"
  | "prepare-help"
  | "help"
  | "quit"
  | "pass"
  | "inspect"
  | "grave"
  | "round"
  | "revive"
  | null;

@Component({
  selector: "game-overlay",
  imports: [
    CardComponent,
    DetailComponent,
    PortraitComponent,
    MoveAnimateDirective,
    MoveHoverDirective,
    MoveTapDirective,
    VoltAlert,
    VoltAlertDescription,
    VoltAvatar,
    VoltBadge,
    VoltCard,
    VoltDialogContent,
    VoltDialogDescription,
    VoltDialogOverlay,
    VoltDialogRoot,
    VoltDialogTitle,
    VoltEmptyState,
    VoltEmptyStateDescription,
    VoltNativeButton,
    VoltRadioGroup,
    VoltRadioItem,
    VoltSlider,
    VoltSwitch,
    LmnArchiveBoxIcon,
    LmnArrowPathIcon,
    LmnArrowRightIcon,
    LmnArrowsPointingInIcon,
    LmnArrowsPointingOutIcon,
    LmnBookOpenIcon,
    LmnHandRaisedIcon,
    LmnHomeIcon,
    LmnInformationCircleIcon,
    LmnMusicalNoteIcon,
    LmnSpeakerWaveIcon,
    LmnXMarkIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ":host{display:contents}",
  templateUrl: "./overlay.html",
})
export class OverlayComponent {
  readonly c = inject(GameStore).controller;
  private readonly toasts = inject(VoltToastService);
  readonly languages = ["Español", "Українська", "English"];

  kind(): DialogKind {
    const modal = this.c.modal;
    if (typeof modal === "string") return modal;
    if (this.c.inspectId) return "inspect";
    if (this.c.graveSide !== undefined) return "grave";
    if (this.c.roundNotice) return "round";
    if (this.c.screen === "battle" && this.c.game?.pending?.side === 0)
      return "revive";
    return null;
  }

  isOpen() {
    return this.kind() !== null;
  }

  /** Round results and revive choices must be answered; confirmations use their own buttons. */
  closable() {
    const kind = this.kind();
    return kind !== null && !["round", "revive", "quit", "pass"].includes(kind);
  }

  alert() {
    return this.kind() === "quit" || this.kind() === "pass";
  }

  onOpenChange(open: boolean) {
    if (!open && this.closable()) this.act("close");
  }

  chooseDifficulty(value: string | null) {
    if (value !== null) this.act("difficulty", { level: value });
  }

  chooseLanguage(value: string | null) {
    if (value !== null) this.act("lang", { lang: value });
  }

  eyebrow(): string | null {
    switch (this.kind()) {
      case "settings":
      case "help":
        return this.c.t("title");
      case "deck-help":
        return this.c.t(this.c.faction);
      case "round":
        return this.c.t("roundEnd");
      case "grave":
        return this.c.t(this.c.graveSide ? "rival" : "you");
      default:
        return null;
    }
  }

  dialogTitle() {
    const score = this.c.roundNotice;
    switch (this.kind()) {
      case "settings":
        return this.c.t("settings");
      case "deck-help":
        return this.c.t("deckInfo");
      case "prepare-help":
        return this.c.t("initialHand");
      case "help":
        return this.c.t("help");
      case "quit":
        return this.c.t("quitTitle");
      case "pass":
        return this.c.t("confirmPass");
      case "inspect":
        return this.c.name(this.c.E.cards[this.c.inspectId!]);
      case "grave":
        return this.c.t("grave");
      case "round":
        return this.c.t(
          !score || score[0] === score[1]
            ? "tieRound"
            : score[0] > score[1]
              ? "wonRound"
              : "lostRound",
        );
      case "revive":
        return this.c.t("revive");
      default:
        return this.c.t("title");
    }
  }

  dialogDescription() {
    const score = this.c.roundNotice;
    switch (this.kind()) {
      case "settings":
        return this.c.t("settingsHint");
      case "deck-help":
        return this.c.t("deckGuide");
      case "prepare-help":
        return this.c.t("prepareSub");
      case "help":
        return this.c.t("intro");
      case "quit":
        return this.c.t("quitBody");
      case "pass":
        return this.c.t("confirmPassBody");
      case "round":
        return this.c.t(
          score && score[0] === score[1] ? "tieExplain" : "nextExplain",
        );
      case "revive":
        return this.c.t("reviveSub");
      default:
        return this.dialogTitle();
    }
  }

  descriptionVisible() {
    const kind = this.kind();
    return kind !== "inspect" && kind !== "grave" && kind !== "help";
  }

  act(action: string, data: Record<string, string | number> = {}) {
    this.c.action(
      action,
      Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
    );
    if (action === "restore") {
      this.toasts.success(this.c.t("deckInfo"), {
        description: this.c.t("restoreToast"),
        duration: 2800,
        placement: "top-end",
      });
    }
  }

  volume(value: number) {
    this.c.setVolume(String(value));
  }
}
