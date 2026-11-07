import { Directive, input, inject, DestroyRef } from "@angular/core";
import { GameStore } from "../game/game.store";
/** Pointer events keep touch dragging and click-to-play available together. */
@Directive({
  selector: "[dragCard]",
  host: { "(pointerdown)": "start($event)", "(click)": "guardClick($event)" },
})
export class DragCardDirective {
  readonly dragCard = input.required<number>();
  private c = inject(GameStore).controller;
  private startPoint: { x: number; y: number; node: HTMLElement } | null = null;
  private ghost: HTMLElement | null = null;
  private suppress = false;
  constructor() {
    const destroy = inject(DestroyRef);
    document.addEventListener("pointermove", this.move, { passive: false });
    document.addEventListener("pointerup", this.end);
    document.addEventListener("pointercancel", this.cancel);
    destroy.onDestroy(() => {
      this.cancel();
      document.removeEventListener("pointermove", this.move);
      document.removeEventListener("pointerup", this.end);
      document.removeEventListener("pointercancel", this.cancel);
    });
  }
  start(e: PointerEvent) {
    if (e.button !== 0 || !this.c.canPlay()) return;
    this.startPoint = {
      x: e.clientX,
      y: e.clientY,
      node: e.currentTarget as HTMLElement,
    };
  }
  guardClick(e: MouseEvent) {
    if (this.suppress) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }
  private move = (e: PointerEvent) => {
    const start = this.startPoint;
    if (!start) return;
    if (
      !this.ghost &&
      Math.hypot(e.clientX - start.x, e.clientY - start.y) > 9
    ) {
      if (!this.c.selectDrag(this.dragCard())) return;
      this.ghost = start.node.cloneNode(true) as HTMLElement;
      this.ghost.classList.add("drag-ghost");
      this.ghost.setAttribute("aria-hidden", "true");
      document.body.append(this.ghost);
    }
    if (this.ghost) {
      e.preventDefault();
      this.ghost.style.left = e.clientX + "px";
      this.ghost.style.top = e.clientY + "px";
      document
        .querySelectorAll(".drop-hover")
        .forEach((el) => el.classList.remove("drop-hover"));
      document
        .elementFromPoint(e.clientX, e.clientY)
        ?.closest(".battle-row.valid,.game-card.target,.effect-ready")
        ?.classList.add("drop-hover");
    }
  };
  private end = (e: PointerEvent) => {
    if (!this.ghost) {
      this.startPoint = null;
      return;
    }
    this.suppress = true;
    setTimeout(() => (this.suppress = false), 0);
    const target = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest<HTMLElement>(
        ".game-card.target,.battle-row.valid,.effect-ready",
      );
    this.cancel();
    if (!target) return;
    if (target.classList.contains("target"))
      this.c.drop(Number(target.dataset["row"]), Number(target.dataset["uid"]));
    else if (target.classList.contains("valid"))
      this.c.drop(Number(target.dataset["row"]));
    else this.c.drop();
  };
  private cancel = () => {
    this.ghost?.remove();
    this.ghost = null;
    this.startPoint = null;
    document
      .querySelectorAll(".drop-hover")
      .forEach((el) => el.classList.remove("drop-hover"));
  };
}
