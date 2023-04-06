import type { DspDefinition } from "../types";

import { el } from "@elemaudio/core";
import { RenderElementary } from "../elementary-web-renderer";

const dspDefinition: DspDefinition = {
  id: "sine-wave",
  name: "Sine wave",
  description:
    "Does a 440Hz sine wave in one ear, and a 441Hz sine wave in the other.",
  Component: () => <RenderElementary node={el.cycle(440)} />,
};

export default dspDefinition;
