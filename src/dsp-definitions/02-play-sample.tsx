import type { DspDefinition } from "../types";

import { el } from "@elemaudio/core";
import {
  RenderElementary,
  updateVirtualFileSystem,
} from "../elementary-web-renderer";

const soundFiles = {
  "/beep.wav": new Float32Array(2048).map((_, i) => Math.sin(i / 10)),
};

const dspDefinition: DspDefinition = {
  id: "play-sample",
  name: "Play sample",
  description: "Generates and plays a sample once per second.",
  Component: () => {
    updateVirtualFileSystem(soundFiles);
    return (
      <RenderElementary
        node={el.sample({ path: "/beep.wav" }, el.train(1), 1)}
      />
    );
  },
};

export default dspDefinition;
