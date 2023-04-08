import type { DspDefinition } from "../types";

import { el } from "@elemaudio/core";
import { core } from "../elementary-web-renderer";

const dspDefinition: DspDefinition = {
  id: "sine-wave",
  name: "Sine wave",
  description: "Does a 440Hz sine wave in one ear and 441Hs in the other.",
  Component: () => {
    core.render(el.cycle(440), el.cycle(441));
    return null;
  },
};

export default dspDefinition;
