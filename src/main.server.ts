import "@angular/platform-server/init";
import { render } from "@analogjs/router/server";
import { withStrataSsrFailureContract } from "@strata-sc/server-components/ssr";

import { AppComponent } from "./app/app.component";
import { config } from "./app/app.config.server";

// Strata's opt-in SSR failure contract: an unexpected render error answers a generic HTTP 500
// instead of Analog's default "200 with a broken document".
export default withStrataSsrFailureContract(render(AppComponent, config));
