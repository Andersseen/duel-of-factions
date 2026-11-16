import {
  Directive,
  ElementRef,
  effect,
  inject,
  input,
  untracked,
} from "@angular/core";
import { MoveAnimator } from "angular-movement";

/**
 * Plays a short "bump" whenever the bound value changes (scores, totals, counters).
 * The first value is rendered without motion, so a screen never bumps on arrival.
 * Uses Movement's imperative `MoveAnimator`, which honours reduced motion and the
 * app-wide `provideMovement()` kill switch.
 */
@Directive({ selector: "[gameBump]" })
export class BumpDirective {
  readonly gameBump = input.required<unknown>();
  readonly #animator = inject(MoveAnimator);
  readonly #element = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    let previous: unknown = undefined;
    let first = true;
    effect(() => {
      const value = this.gameBump();
      if (first || Object.is(value, previous)) {
        first = false;
        previous = value;
        return;
      }
      previous = value;
      untracked(() =>
        this.#animator.animate(
          this.#element,
          { scale: [1, 1.28, 1], opacity: [0.6, 1, 1] },
          { duration: "360ms", easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
        ),
      );
    });
  }
}
