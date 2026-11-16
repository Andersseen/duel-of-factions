import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import {
  ServerComponent,
  StrataClientBoundary,
} from "@strata-sc/server-components";
import { VoltBadge, VoltCard } from "@voltui/components";

import { PortraitElementComponent } from "../game/components/portrait.component";
import { CodexCardComponent } from "./codex-card.component";
import { CodexLanguageComponent } from "./codex-language.component";
import { CodexPlayComponent } from "./codex-play.component";
import { CodexRepository } from "./codex.repository";

/**
 * The card codex, rendered by Strata on the server. In the browser graph this module is
 * replaced by a generated surrogate: neither it, `CodexRepository`, nor the catalogue they read
 * ship to the page. Only the two `[strataClient]` islands hydrate.
 *
 * Volt's badge and card are rendered here as static, server-owned markup (no bindings to
 * outputs), which the Server Component analysis treats as opaque package elements.
 */
@ServerComponent()
@Component({
  selector: "duel-codex",
  imports: [
    StrataClientBoundary,
    VoltBadge,
    VoltCard,
    PortraitElementComponent,
    CodexCardComponent,
    CodexLanguageComponent,
    CodexPlayComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let v = view;
    <header class="codex-header">
      <div>
        <div class="eyebrow">Duel of Factions</div>
        <h1>{{ v.text["codex"] }}</h1>
        <p>{{ v.text["codexSub"] }}</p>
      </div>
      <!-- Inputs render the island on the server; [strataClient] carries the same props to the browser. -->
      <duel-codex-language
        [current]="v.lang"
        [label]="v.text['language']"
        [options]="v.languages"
        [strataClient]="{
          current: v.lang,
          label: v.text['language'],
          options: v.languages,
        }"
      />
    </header>

    <nav class="codex-index" [attr.aria-label]="v.text['codex']">
      @for (entry of v.factions; track entry.faction.id) {
        <a [href]="'#' + entry.faction.id"
          >{{ entry.faction.emblem }} {{ entry.faction.name }}</a
        >
      }
      <a href="#neutral">{{ v.text["neutralCards"] }}</a>
    </nav>

    @for (entry of v.factions; track entry.faction.id) {
      <section
        class="codex-faction"
        [id]="entry.faction.id"
        [attr.data-faction]="entry.faction.id"
        [attr.aria-labelledby]="entry.faction.id + '-title'"
      >
        <volt-card class="codex-faction-head">
          <game-portrait
            class="codex-leader"
            [art]="entry.faction.leader.art"
          />
          <div class="codex-faction-copy">
            <div class="eyebrow">
              {{ entry.faction.emblem }} {{ entry.faction.trait }}
            </div>
            <h2 [id]="entry.faction.id + '-title'">{{ entry.faction.name }}</h2>
            <p>{{ entry.faction.description }}</p>
            <p class="codex-leader-ability">
              <strong>{{ entry.faction.leader.name }}</strong> ·
              {{ entry.faction.leader.ability }}
            </p>
            <div class="codex-stats">
              <volt-badge variant="outline"
                >{{ entry.cards.length }} {{ v.text["cards"] }}</volt-badge
              >
              <volt-badge variant="secondary"
                >{{ entry.starter.units }} {{ v.text["units"] }} ·
                {{ entry.starter.special }} {{ v.text["special"] }}</volt-badge
              >
            </div>
          </div>
          <duel-codex-play
            [faction]="entry.faction.id"
            [lang]="v.lang"
            [label]="v.text['playFaction']"
            [strataClient]="{
              faction: entry.faction.id,
              lang: v.lang,
              label: v.text['playFaction'],
            }"
          />
        </volt-card>
        <ul class="codex-cards">
          @for (card of entry.cards; track card.id) {
            <li class="codex-entry">
              <duel-codex-card [card]="card" />
              <div>
                <h3>{{ card.name }}</h3>
                <p class="codex-meta">
                  {{ card.rowLabel }}{{ card.unit ? " · " + card.power : "" }} ·
                  {{ card.maxCopies }} {{ v.text["copies"] }}
                </p>
                <p>
                  <strong>{{ card.abilityName }}.</strong>
                  {{ card.abilityText }}
                </p>
              </div>
            </li>
          }
        </ul>
      </section>
    }

    <section class="codex-faction" id="neutral" aria-labelledby="neutral-title">
      <h2 id="neutral-title">{{ v.text["neutralCards"] }}</h2>
      <ul class="codex-cards">
        @for (card of v.neutral; track card.id) {
          <li class="codex-entry">
            <duel-codex-card [card]="card" />
            <div>
              <h3>{{ card.name }}</h3>
              <p class="codex-meta">
                {{ card.rowLabel }} · {{ card.maxCopies }}
                {{ v.text["copies"] }}
              </p>
              <p>
                <strong>{{ card.abilityName }}.</strong> {{ card.abilityText }}
              </p>
            </div>
          </li>
        }
      </ul>
    </section>
  `,
})
export class CodexServerComponent {
  protected readonly view = inject(CodexRepository).view();
}
