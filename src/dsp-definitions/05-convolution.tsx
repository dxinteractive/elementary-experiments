import type { DspComponentProps, DspDefinition } from "../types";

import { el } from "@elemaudio/core";
import { useFetchSoundFiles } from "../fetch";
import { useState } from "react";
import { core, updateVirtualFileSystem } from "../elementary-web-renderer";

const IMPULSE_RESPONSES = [
  "1gdsh6_small_speaker_ussr.wav",
  "4good_tablet.wav",
  "20mm_loudspeaker.wav",
  "28mm_speaker.wav",
  "cheap_garniture_headphones.wav",
  "cheap_garniture_phone_like.wav",
  "large_cheap_headphones.wav",
  "piezo_from_a_music_postcard.wav",
  "xiaomi_redmi_3s_loudspeaker.wav",
];

const SOUND_FILE_PATHS = [
  "/audio/music/320732__shadydave__time-break-drum-only.mp3",
  ...IMPULSE_RESPONSES.map((ir) => `/audio/ir/lofi_impulse_responses/${ir}`),
];

function Component({ audioContext }: DspComponentProps) {
  const [selectedIR, setSelectedIR] = useState("");

  const soundFiles = useFetchSoundFiles(audioContext, SOUND_FILE_PATHS);
  if (!soundFiles) return null;

  updateVirtualFileSystem(soundFiles);

  const drums = el.sample(
    {
      path: "/audio/music/320732__shadydave__time-break-drum-only.mp3",
      mode: "loop",
      stopOffset: 2000, // make it loop cleanly by cutting off end of sample
    },
    1, // always high so loop continues
    1 // playback rate
  );

  const convolved = el.convolve(
    {
      path: `/audio/ir/lofi_impulse_responses/${selectedIR}`,
    },
    drums
  );

  const fx = selectedIR ? convolved : drums;
  core.render(fx, fx);

  return (
    <label>
      impulse response{" "}
      <select
        value={selectedIR}
        onChange={(e) => setSelectedIR(e.target.value)}
      >
        <option value="">none</option>
        {IMPULSE_RESPONSES.map((ir) => (
          <option key={ir} value={ir}>
            {ir}
          </option>
        ))}
      </select>
    </label>
  );
}

const dspDefinition: DspDefinition = {
  id: "convolution",
  filename: "05-convolution.tsx",
  oscope: true,
  name: "Convolution",
  description: "Passes a sound through different impulse responses",
  Component,
};

export default dspDefinition;
