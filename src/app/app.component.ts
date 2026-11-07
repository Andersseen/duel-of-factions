import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToastContainerComponent } from "@quartz-headless/primitives";
@Component({
  selector: "app-root",
  imports: [RouterOutlet, ToastContainerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: "<router-outlet /><qz-toast-container />",
})
export class AppComponent {}
