import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from "@angular/core";
let nextPortrait = 0;
@Component({
  selector: "[gamePortrait]",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "portrait" },
  template: `<svg
    class="portrait-image"
    [attr.viewBox]="atlas().viewBox"
    [attr.preserveAspectRatio]="contain() ? 'xMidYMid meet' : 'xMidYMin slice'"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <clipPath [attr.id]="clip">
        <rect
          [attr.x]="atlas().x"
          [attr.y]="atlas().y"
          [attr.width]="atlas().cell - 4"
          [attr.height]="atlas().cell - 4"
        />
      </clipPath>
    </defs>
    <image
      [attr.href]="'/assets/' + atlas().file"
      [attr.width]="atlas().width"
      [attr.height]="atlas().height"
      [attr.clip-path]="'url(#' + clip + ')'"
    />
  </svg>`,
})
export class PortraitComponent {
  readonly gamePortrait = input.required<number>();
  readonly contain = input(false);
  readonly clip = "portrait-" + nextPortrait++;
  readonly atlas = computed(() => {
    const i = this.gamePortrait();
    let file = "portraits.png",
      width = 1448,
      height = 1086,
      cols = 4,
      index = i;
    if (i >= 200) {
      const fi = Math.floor((i - 200) / 8);
      file = ["forest", "granite", "tides", "sun"][fi] + "-cartoon.png";
      width = 2048;
      height = 1024;
      cols = 4;
      index = (i - 200) % 8;
    } else if (i === 0 || i === 6) {
      file = "leaders.png";
      width = 1774;
      height = 887;
      cols = 2;
      index = i === 0 ? 0 : 1;
    } else if (i >= 12) {
      file = i >= 18 ? "sun.png" : "tides.png";
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
  });
}
