import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "polli-connect": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        "app-key"?: string;
        budget?: string | number;
        expiry?: string | number;
        models?: string;
        permissions?: string;
        "hide-buy-pollen"?: boolean | string;
      };
    }
  }
}
