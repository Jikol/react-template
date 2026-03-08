import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { mergeProviders } from "@/utils";

const ProvidersTree = mergeProviders([]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProvidersTree>FIZZ BUZZ</ProvidersTree>
  </StrictMode>
);
