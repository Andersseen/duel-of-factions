import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import type { CardView } from "../game/catalog";
import { PortraitElementComponent } from "../game/components/portrait.component";

/**
 * Server-owned card tile. It draws the same DOM as the in-game `CardComponent` (so
 * `styles/card.css` applies) but reads a plain `CardView`, without the game store.
 */
@Component({
  selector: "duel-codex-card",
  imports: [PortraitElementComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "game-card",
    "aria-hidden": "true",
    "[attr.data-faction]": "card().faction",
    "[class.hero]": "card().hero",
  },
  template: `
    @if (card().art >= 0) {
      <game-portrait class="card-art" [art]="card().art" />
    } @else {
      <span class="card-art special-art">{{ card().abilitySymbol }}</span>
    }
    <span class="power">{{ card().unit ? card().power : "·" }}</span>
    <span class="card-ability" [attr.data-ability]="card().ability || 'unit'">{{
      card().abilitySymbol || card().rowSymbol
    }}</span>
    <span class="card-name">{{ card().name }}</span>
    <span class="card-row">{{
      card().unit ? card().abilityName : card().rowLabel
    }}</span>
  `,
})
export class CodexCardComponent {
  readonly card = input.required<CardView>();
}
