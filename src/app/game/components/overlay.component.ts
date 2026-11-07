import {
  Component,
  ChangeDetectionStrategy,
  effect,
  inject,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from "@angular/core";
import { GameStore } from "../game.store";
import { CardComponent } from "./card.component";
import { DetailComponent } from "./detail.component";
import {
  DialogRef,
  DialogService,
  SwitchDirective,
  ToastService,
} from "@quartz-headless/primitives";
import { MoveHoverDirective, MoveTapDirective } from "angular-movement";
import { VoltNativeButton } from "@voltui/components";
@Component({
  selector: "game-overlay",
  imports: [
    CardComponent,
    DetailComponent,
    SwitchDirective,
    MoveHoverDirective,
    MoveTapDirective,
    VoltNativeButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ":host{display:contents}",
  templateUrl: "./overlay.html",
})
export class OverlayComponent {
  readonly c = inject(GameStore).controller;
  private readonly dialogs = inject(DialogService);
  private readonly toasts = inject(ToastService);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly dialogTemplate =
    viewChild.required<TemplateRef<unknown>>("dialogTemplate");
  private activeDialog: DialogRef | null = null;

  private readonly syncDialog = effect(() => {
    const isOpen = Boolean(
      this.c.modal ||
        this.c.roundNotice ||
        (this.c.screen === "battle" && this.c.game?.pending?.side === 0),
    );
    const activeDialog = this.activeDialog;

    if (isOpen && !activeDialog) {
      const dialog = this.dialogs.open(
        this.dialogTemplate(),
        this.viewContainer,
        {
          position: "center",
          panelClass: "qz-game-dialog",
          backdropClass: "qz-game-backdrop",
          ariaLabel: this.c.t("title"),
        },
      );
      this.activeDialog = dialog;
      dialog.closed$.subscribe(() => {
        if (this.activeDialog !== dialog) return;
        this.activeDialog = null;
        this.act("close");
      });
    } else if (!isOpen && activeDialog) {
      this.activeDialog = null;
      activeDialog.close();
    }
  });

  act(action: string, data: Record<string, string | number> = {}) {
    this.c.action(
      action,
      Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
    );
    if (action === "restore") {
      this.toasts.success(this.c.t("restoreToast"), this.c.t("deckInfo"), {
        duration: 2800,
        position: "top-right",
      });
    }
  }
  volume(event: Event) {
    this.c.setVolume((event.target as HTMLInputElement).value);
  }
}
