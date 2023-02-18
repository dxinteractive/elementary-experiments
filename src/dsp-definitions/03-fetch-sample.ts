import type { DspDefinition } from "../types";

import { el } from "@elemaudio/core";
import WebRenderer from "@elemaudio/web-renderer";
import { fetchFile } from "../fetch";

async function fetchSoundFile(liveAudioContext: AudioContext, path: string) {
  const response = await fetchFile(path);
  if (!response.ok) {
    throw new Error(`Could not load sound file "${path}"`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return await liveAudioContext.decodeAudioData(arrayBuffer);
}

async function loadSoundFiles(
  liveAudioContext: AudioContext,
  core: WebRenderer,
  paths: string[]
) {
  const buffers = await Promise.all(
    paths.map((path) => fetchSoundFile(liveAudioContext, path))
  );
  const obj: Record<string, Float32Array> = {};
  paths.forEach((path, i) => {
    obj[path] = buffers[i].getChannelData(0);
  });
  core.updateVirtualFileSystem(obj);
}

async function callback(
  liveAudioContext: AudioContext
  // _renderResults: RenderResults
) {
  const core = new WebRenderer();

  core.on("load", async () => {
    await loadSoundFiles(liveAudioContext, core, [
      "/audio/tonejs-instruments/harp/D4.wav",
      "/audio/tonejs-instruments/harp/F4.wav",
      "/audio/tonejs-instruments/harp/A4.wav",
      "/audio/tonejs-instruments/harp/C5.wav",
    ]);

    const harps = el.add(
      el.sample(
        { path: "/audio/tonejs-instruments/harp/D4.wav" },
        el.train(0.4),
        1
      ),
      el.sample(
        { path: "/audio/tonejs-instruments/harp/F4.wav" },
        el.train(0.6),
        1
      ),
      el.sample(
        { path: "/audio/tonejs-instruments/harp/A4.wav" },
        el.train(0.8),
        1
      ),
      el.sample(
        { path: "/audio/tonejs-instruments/harp/C5.wav" },
        el.train(1),
        1
      )
    );

    core.render(harps, harps);
  });

  const node = await core.initialize(liveAudioContext, {
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
  id: "fetch-sample",
  name: "Fetch sample",
  description: "Fetches and plays a set of samples.",
  type: "callback",
  callback,
};

export default dspDefinition;
