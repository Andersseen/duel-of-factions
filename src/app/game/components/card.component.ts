import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
} from "@angular/core";
import { GameStore } from "../game.store";
import { CardDefinition, CardInstance } from "../models";
import { PortraitComponent } from "./portrait.component";

/**
 * A playing card. It is a domain component, not a UI atom: interactive cards use a
 * native `<button>` host so keyboard, focus and disabled states stay native (read-only
 * previews use a `<div>`), and the face is the
 * game's own artwork. Volt styles the interface around the cards, not the cards.
 */
@Component({
  selector: "button[gameCard], div[gameCard]",
  imports: [PortraitComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "game-card",
    "[attr.data-faction]": "d().f",
    "[class.hero]": "d().ability === 'hero'",
    "[class.selected]": "active()",
    "[class.target]": "target()",
    "[attr.aria-pressed]": "active() || null",
    "[attr.role]": "isButton ? null : 'img'",
    "[attr.aria-label]": "label()",
    "[attr.data-card]": "d().id",
  },
  template: `
    @if (d().art >= 0) {
      <span class="card-art" [gamePortrait]="d().art"></span>
    } @else {
      <span class="card-art special-art" aria-hidden="true">{{
        c.symbols[d().ability]
      }}</span>
    }
    <span
      class="power"
      [class.boosted]="boosted()"
      [class.weakened]="weakened()"
      aria-hidden="true"
      >{{ power() ?? (d().unit ? d().power : "·") }}</span
    >
    <span
      class="card-ability"
      [attr.data-ability]="d().ability || 'unit'"
      aria-hidden="true"
      >{{ c.symbols[d().ability] || c.rowIcon[d().row] }}</span
    >
    <span class="card-name" aria-hidden="true">{{ c.name(d()) }}</span>
    <span class="card-row" aria-hidden="true">{{ subtitle() }}</span>
  `,
})
export class CardComponent {
  readonly c = inject(GameStore).controller;
  readonly isButton =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName ===
    "BUTTON";
  readonly gameCard = input.required<CardDefinition | CardInstance>();
  /** Current strength on the board, when it differs from the printed value. */
  readonly power = input<number | null>(null);
  readonly active = input(false);
  readonly target = input(false);
  readonly d = computed(() => this.c.definition(this.gameCard()));
  readonly boosted = computed(() => {
    const p = this.power();
    return p !== null && this.d().unit && p > this.d().power;
  });
  readonly weakened = computed(() => {
    const p = this.power();
    return p !== null && this.d().unit && p < this.d().power;
  });
  readonly subtitle = computed(() => {
    this.c.revision();
    const d = this.d();
    if (!d.unit) return this.c.t("special");
    if (d.f === "neutral") return this.c.t("neutral");
    return d.ability ? this.c.ab(d)[this.c.lang] : this.c.t(d.row);
  });
  readonly label = computed(() => {
    this.c.revision();
    const d = this.d();
    const strength = this.power() ?? d.power;
    return `${this.c.name(d)}, ${strength}, ${this.c.ab(d)[this.c.lang]}`;
  });
}
