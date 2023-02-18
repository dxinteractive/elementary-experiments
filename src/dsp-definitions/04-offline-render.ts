import type { DspDefinition, RenderResults } from "../types";

import { el } from "@elemaudio/core";
import OfflineRenderer from "@elemaudio/offline-renderer";

async function callback(
  liveAudioContext: AudioContext,
  renderResults: RenderResults
) {
  const offline = new OfflineRenderer();

  await offline.initialize({
    numInputChannels: 0,
    numOutputChannels: 1,
    sampleRate: liveAudioContext.sampleRate,
  });

  const rendered = [new Float32Array(liveAudioContext.sampleRate)];
  offline.render(el.noise());
  offline.process([], rendered);

  renderResults([
    {
      name: "rendered-noise",
      output: rendered,
    },
  ]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return () => {};
}

const dspDefinition: DspDefinition = {
  id: "offline-render",
  name: "Offline render",
  description: "Offline renders a noise burst.",
  type: "callback",
  callback,
};

export default dspDefinition;
