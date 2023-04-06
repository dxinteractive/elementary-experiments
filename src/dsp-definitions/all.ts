import type { DspDefinition } from "../types";

import sineWave from "./01-sine-wave";
import playSample from "./02-play-sample";
import fetchSample from "./03-fetch-sample";
import offlineRender from "./04-offline-render";
import convolution from "./05-convolution";

export const all: DspDefinition[] = [
  sineWave,
  playSample,
  fetchSample,
  offlineRender,
  convolution,
];
