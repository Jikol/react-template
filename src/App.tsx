import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { mergeProviders } from "@/utils";

import log from "/logger";

log.debug("Global config", CONFIG);

const ProvidersTree = mergeProviders([]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProvidersTree>FIZZ BUZZ</ProvidersTree>
  </StrictMode>
);
