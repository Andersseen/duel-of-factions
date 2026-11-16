import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { StrataDocumentNavigator } from "@strata-sc/server-components/navigation";
import { VoltNativeButton } from "@voltui/components";
import { MoveHoverDirective, MoveTapDirective } from "angular-movement";
import { LmnArrowRightIcon } from "lumen-icons/arrow-right";

/**
 * Client island, one per faction: opens the game straight in that faction's deck builder.
 * The game is a client-only route, so this is a document navigation to `/?faction=&lang=`.
 */
@Component({
  selector: "duel-codex-play",
  imports: [
    VoltNativeButton,
    MoveHoverDirective,
    MoveTapDirective,
    LmnArrowRightIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      voltButton
      moveWhileHover="lift"
      moveWhileTap="press"
      (click)="play()"
    >
      {{ label() }} <lmn-arrow-right [size]="16" />
    </button>
  `,
})
export class CodexPlayComponent {
  readonly faction = input.required<string>();
  readonly lang = input.required<string>();
  readonly label = input.required<string>();

  readonly #navigator = inject(StrataDocumentNavigator);

  protected play(): void {
    this.#navigator.navigate(["/"], {
      queryParams: { faction: this.faction(), lang: this.lang() },
    });
  }
}
