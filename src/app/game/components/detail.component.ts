import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import {
  VoltBadge,
  VoltEmptyState,
  VoltEmptyStateDescription,
} from "@voltui/components";
import { LmnSparklesIcon } from "lumen-icons/sparkles";
import { GameStore } from "../game.store";
import { CardComponent } from "./card.component";

/** Read-only card description used by the deck builder, the board and the inspect dialog. */
@Component({
  selector: "game-detail",
  imports: [
    CardComponent,
    LmnSparklesIcon,
    VoltBadge,
    VoltEmptyState,
    VoltEmptyStateDescription,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ":host{display:contents}",
  template: `
    @if (id(); as id) {
      @if (c.E.cards[id]; as d) {
        @if (large()) {
          <div class="detail-card" [gameCard]="d"></div>
        }
        <div class="detail-meta">
          <volt-badge variant="outline">{{ c.ab(d)[c.lang] }}</volt-badge>
          @if (d.unit) {
            <volt-badge variant="secondary"
              >{{ c.t(d.row) }} · {{ d.power }}</volt-badge
            >
          } @else {
            <volt-badge variant="secondary">{{ c.t("special") }}</volt-badge>
          }
        </div>
        <h3>{{ c.name(d) }}</h3>
        <p>{{ c.ab(d)[c.lang + 3] }}</p>
        @if (d.f === "neutral" && d.unit) {
          <p class="notice">{{ c.t("neutralUnit") }}</p>
        }
      }
    } @else {
      <volt-empty-state class="detail-empty">
        <lmn-sparkles slot="icon" [size]="32" />
        <volt-empty-state-description>{{
          c.t("inspect")
        }}</volt-empty-state-description>
      </volt-empty-state>
    }
  `,
})
export class DetailComponent {
  readonly c = inject(GameStore).controller;
  readonly id = input<string | null | undefined>();
  readonly large = input(false);
}
