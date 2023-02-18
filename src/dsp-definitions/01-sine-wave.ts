import type { DspDefinition, RenderResults } from "../types";

import { el } from "@elemaudio/core";
import WebRenderer from "@elemaudio/web-renderer";

async function callback(
  liveAudioContext: AudioContext,
  _renderResults: RenderResults
) {
  const core = new WebRenderer();

  core.on("load", () => {
    core.render(el.cycle(440), el.cycle(441));
  });

  let node = await core.initialize(liveAudioContext, {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [2],
  });

  node.connect(liveAudioContext.destination);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return () => {
    node.disconnect(liveAudioContext.destination);
  };
}

const dspDefinition: DspDefinition = {
  id: "sine-wave",
  name: "Sine wave",
  description:
    "Does a 440Hz sine wave in one ear, and a 441Hz sine wave in the other.",
  type: "callback",
  callback,
};

export default dspDefinition;
