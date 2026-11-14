// Type-only side effect: register the <polli-connect> JSX element types for
// consumers (stripped at build time, no runtime import).
import type {} from "./jsx";

export {
  PolliConnect,
  type PolliConnectProps,
} from "./PolliConnect";
export { usePollenConnect, type WalletMode } from "./usePollenConnect";
export {
  POLLI_CONNECT_SCRIPT_SRC,
  type PolliConnectAttributes,
  type PolliConnectElement,
} from "./widget";
