import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

export interface PortraitAtlas {
  readonly file: string;
  readonly width: number;
  readonly height: number;
  readonly cell: number;
  readonly x: number;
  readonly y: number;
  readonly viewBox: string;
}

/** Where portrait `i` lives in the sprite sheets under `public/assets`. */
export function portraitAtlas(i: number): PortraitAtlas {
  let file = "portraits.webp",
    width = 1448,
    height = 1086,
    cols = 4,
    index = i;
  if (i >= 200) {
    const fi = Math.floor((i - 200) / 8);
    file = ["forest", "granite", "tides", "sun"][fi] + "-cartoon.webp";
    width = 2048;
    height = 1024;
    cols = 4;
    index = (i - 200) % 8;
  } else if (i === 0 || i === 6) {
    file = "leaders.webp";
    width = 1774;
    height = 887;
    cols = 2;
    index = i === 0 ? 0 : 1;
  } else if (i >= 12) {
    file = i >= 18 ? "sun.webp" : "tides.webp";
    width = 1536;
    height = 1024;
    cols = 3;
    index = i >= 18 ? i - 18 : i - 12;
  }
  const cell = width / cols,
    x = (index % cols) * cell + 2,
    y = Math.floor(index / cols) * cell + 2;
  return {
    file,
    width,
    height,
    cell,
    x,
    y,
    viewBox: `${x} ${y} ${cell - 4} ${cell - 4}`,
  };
}

/** Every sprite sheet `portraitAtlas` can return, served from `public/art`. */
export const PORTRAIT_SHEETS = [
  "leaders.webp",
  "portraits.webp",
  "tides.webp",
  "sun.webp",
  "forest-cartoon.webp",
  "granite-cartoon.webp",
  "tides-cartoon.webp",
  "sun-cartoon.webp",
] as const;

/**
 * Downloads and decodes every sheet into the browser cache while the menu is idle, so cards
 * show their art immediately instead of popping in on the first match. Browser only.
 */
export function warmPortraitSheets() {
  const idle =
    globalThis.requestIdleCallback ??
    ((run: () => void) => setTimeout(run, 200));
  idle(() => {
    for (const file of PORTRAIT_SHEETS) {
      const image = new Image();
      image.src = "/art/" + file;
      image.decode().catch(() => undefined);
    }
  });
}

let nextPortrait = 0;

/** Game portrait as an attribute: `<div [gamePortrait]="art">`. */
@Component({
  selector: "[gamePortrait]",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "portrait" },
  templateUrl: "./portrait.component.html",
})
export class PortraitComponent {
  readonly gamePortrait = input.required<number>();
  readonly contain = input(false);
  readonly clip = "portrait-" + nextPortrait++;
  readonly atlas = computed(() => portraitAtlas(this.gamePortrait()));
}

/**
 * The same portrait as an element, `<game-portrait [art]="art" />`. Strata Server Components
 * only compose local components with a single custom element selector, so server-rendered
 * pages (the codex) use this one.
 */
@Component({
  selector: "game-portrait",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "portrait" },
  templateUrl: "./portrait.component.html",
})
export class PortraitElementComponent {
  readonly art = input.required<number>();
  readonly contain = input(false);
  readonly clip = "portrait-" + nextPortrait++;
  readonly atlas = computed(() => portraitAtlas(this.art()));
}
