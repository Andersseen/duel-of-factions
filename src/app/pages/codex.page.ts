import { defineRouteMeta } from "@analogjs/router";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
  StrataDocumentLink,
  strataDocumentNavigationGuard,
} from "@strata-sc/server-components/navigation";
import { LmnArrowLeftIcon } from "lumen-icons/arrow-left";

import { CodexServerComponent } from "../codex/codex.server-component";

// The codex is a Server Component route: reached by document navigation only. The guard turns
// any Angular Router activation into one, so the empty browser surrogate is never shown.
export const routeMeta = defineRouteMeta({
  title: "Codex · Duel of Factions",
  canActivate: [strataDocumentNavigationGuard],
});

@Component({
  selector: "duel-codex-page",
  imports: [CodexServerComponent, StrataDocumentLink, LmnArrowLeftIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="codex">
      <a class="codex-back" [strataDocumentLink]="['/']"
        ><lmn-arrow-left [size]="16" /> Duel of Factions</a
      >
      <duel-codex />
    </main>
  `,
})
export default class CodexPage {}
