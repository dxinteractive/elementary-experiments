import type { DspDefinition } from "../types";

import { el } from "@elemaudio/core";
import { useFetchSoundFiles } from "../fetch";
import { core, updateVirtualFileSystem } from "../elementary-web-renderer";

const HARP_SOUND_FILES = [
  "/audio/tonejs-instruments/harp/D4.wav",
  "/audio/tonejs-instruments/harp/F4.wav",
  "/audio/tonejs-instruments/harp/A4.wav",
  "/audio/tonejs-instruments/harp/C5.wav",
];

const dspDefinition: DspDefinition = {
  id: "fetch-sample",
  name: "Fetch sample",
  description: "Fetches and plays a set of samples.",
  Component: ({ audioContext }) => {
    const soundFiles = useFetchSoundFiles(audioContext, HARP_SOUND_FILES);
    if (!soundFiles) return null;

    updateVirtualFileSystem(soundFiles);

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
    return null;
  },
};

export default dspDefinition;
