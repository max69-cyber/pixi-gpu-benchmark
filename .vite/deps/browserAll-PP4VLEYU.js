import {
  AccessibilitySystem,
  DOMPipe,
  EventSystem,
  FederatedContainer,
  accessibilityTarget
} from "./chunk-TFNFEDDF.js";
import "./chunk-NFJHSZZJ.js";
import "./chunk-G3GZFGKG.js";
import "./chunk-IE2EXWSD.js";
import {
  Container,
  extensions
} from "./chunk-JMOKUFX5.js";

// node_modules/pixi.js/lib/accessibility/init.mjs
extensions.add(AccessibilitySystem);
extensions.mixin(Container, accessibilityTarget);

// node_modules/pixi.js/lib/events/init.mjs
extensions.add(EventSystem);
extensions.mixin(Container, FederatedContainer);

// node_modules/pixi.js/lib/dom/init.mjs
extensions.add(DOMPipe);
//# sourceMappingURL=browserAll-PP4VLEYU.js.map
