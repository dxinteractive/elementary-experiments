import type { DspDefinition } from "../types";

import { el } from "@elemaudio/core";
import OfflineRenderer from "@elemaudio/offline-renderer";
import { useEffect } from "react";

const dspDefinition: DspDefinition = {
  id: "offline-render",
  filename: "04-offline-render.tsx",
  oscope: false,
  name: "Offline render",
  description: "Offline renders a noise burst.",
  Component: ({ audioContext, renderResults }) => {
    useEffect(() => {
      const offline = new OfflineRenderer();

      offline
        .initialize({
          numInputChannels: 0,
          numOutputChannels: 1,
          sampleRate: audioContext.sampleRate,
        })
        .then(() => {
          const rendered = [new Float32Array(audioContext.sampleRate)];
          offline.render(el.noise());
          offline.process([], rendered);

          renderResults([
            {
              name: "rendered-noise",
              output: rendered,
            },
          ]);
        });
    }, []);
    return null;
  },
};

export default dspDefinition;
