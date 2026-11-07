import {
  Component,
  ChangeDetectionStrategy,
  input,
  inject,
} from "@angular/core";
import { GameStore } from "../game/game.store";
import { CardComponent } from "./card.component";
@Component({
  selector: "game-detail",
  imports: [CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ":host{display:contents}",
  template: ` @if (id(); as id) {
      @if (c.E.cards[id]; as d) {
        @if (large()) {
          <button [gameCard]="d"></button>
        }
        <div class="eyebrow">{{ c.ab(d)[c.lang] }}</div>
        <h3>{{ c.name(d) }}</h3>
        <p>{{ c.ab(d)[c.lang + 3] }}</p>
        @if (d.f === "neutral" && d.unit) {
          <p class="notice">{{ c.t("neutralUnit") }}</p>
        }
        <p>{{ d.unit ? c.t(d.row) + " · " + d.power : c.t("special") }}</p>
      }
    } @else {
      <div class="empty-detail">❖</div>
      <p>{{ c.t("inspect") }}</p>
    }`,
})
export class DetailComponent {
  readonly c = inject(GameStore).controller;
  readonly id = input<string | null | undefined>();
  readonly large = input(false);
}
