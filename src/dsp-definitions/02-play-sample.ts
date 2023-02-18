import type { DspDefinition } from "../types";

import { el } from "@elemaudio/core";
import WebRenderer from "@elemaudio/web-renderer";

async function callback(
  liveAudioContext: AudioContext
  // _renderResults: RenderResults
) {
  const core = new WebRenderer();

  core.on("load", () => {
    const beeps = el.sample({ path: "/beep.wav" }, el.train(1), 1);
    core.render(beeps, beeps);
  });

  const node = await core.initialize(liveAudioContext, {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [2],
    processorOptions: {
      virtualFileSystem: {
        "/beep.wav": new Float32Array(2048).map((_, i) => Math.sin(i / 10)),
      },
    },
  });

  node.connect(liveAudioContext.destination);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return () => {
    node.disconnect(liveAudioContext.destination);
  };
}

const dspDefinition: DspDefinition = {
  id: "play-sample",
  name: "Play sample",
  description: "Generates and plays a sample once per second.",
  type: "callback",
  callback,
};

export default dspDefinition;
