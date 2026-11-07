import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  inject,
} from "@angular/core";
import { GameStore } from "../game/game.store";
import { CardDefinition, CardInstance } from "../game/models";
import { PortraitComponent } from "./portrait.component";
@Component({
  selector: "button[gameCard]",
  imports: [PortraitComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "classes()",
    "[attr.aria-label]": "label()",
    "[attr.title]": "label()",
    "[attr.data-card]": "d().id",
  },
  template: ` @if (d().art >= 0) {
      <div class="card-art" [gamePortrait]="d().art"></div>
    } @else {
      <div class="card-art special-art">{{ c.symbols[d().ability] }}</div>
    }
    <span class="power">{{ power() ?? (d().unit ? d().power : "·") }}</span
    ><span class="card-ability" [attr.data-ability]="d().ability || 'unit'">{{
      c.symbols[d().ability] || c.rowIcon[d().row]
    }}</span>
    <div class="card-name">{{ c.name(d()) }}</div>
    <div class="card-row">
      {{
        d().unit
          ? d().f === "neutral"
            ? c.t("neutral")
            : d().ability
              ? c.ab(d())[c.lang]
              : c.t(d().row)
          : c.t("special")
      }}
    </div>`,
})
export class CardComponent {
  readonly c = inject(GameStore).controller;
  readonly gameCard = input.required<CardDefinition | CardInstance>();
  readonly power = input<number | null>(null);
  readonly active = input(false);
  readonly target = input(false);
  readonly d = computed(() => this.c.definition(this.gameCard()));
  readonly classes = computed(
    () =>
      `game-card ${this.d().f} ${this.d().ability === "hero" ? "hero" : ""} ${this.active() ? "selected" : ""} ${this.target() ? "target" : ""}`,
  );
  readonly label = computed(() => {
    this.c.revision();
    return `${this.c.name(this.d())}, ${this.d().power}, ${this.c.ab(this.d())[this.c.lang]}`;
  });
}
