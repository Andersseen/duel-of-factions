import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { StrataDocumentNavigator } from "@strata-sc/server-components/navigation";
import { VoltToggleGroup, VoltToggleGroupItem } from "@voltui/components";

/**
 * Client island: switches the codex language. The codex is server-rendered per language, so a
 * change is a document navigation; the choice is also stored for the game (`df-lang`).
 */
@Component({
  selector: "duel-codex-language",
  imports: [VoltToggleGroup, VoltToggleGroupItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <volt-toggle-group
      class="codex-language"
      type="single"
      orientation="horizontal"
      [allowDeselection]="false"
      [value]="[current()]"
      (valueChange)="choose($event)"
      [attr.aria-label]="label()"
    >
      @for (option of options(); track option.code) {
        <volt-toggle-group-item [value]="option.code">{{
          option.label
        }}</volt-toggle-group-item>
      }
    </volt-toggle-group>
  `,
})
export class CodexLanguageComponent {
  readonly current = input.required<string>();
  readonly label = input.required<string>();
  readonly options =
    input.required<readonly { code: string; label: string }[]>();

  readonly #navigator = inject(StrataDocumentNavigator);

  protected choose(value: string[]): void {
    const lang = value[0];
    if (!lang || lang === this.current()) return;
    const index = this.options().findIndex((option) => option.code === lang);
    try {
      localStorage.setItem("df-lang", JSON.stringify(index));
    } catch {
      // Storage may be unavailable (private mode); the navigation still works.
    }
    this.#navigator.navigate(["/codex"], { queryParams: { lang } });
  }
}
