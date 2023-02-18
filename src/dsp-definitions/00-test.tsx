import type { DspDefinition } from "../types";

function component(liveAudioContext: AudioContext) {
  const handleClick = () => playSounds(liveAudioContext);
  return <div onClick={handleClick}>click here to hear loud things</div>;
}

const dspDefinition: DspDefinition = {
  id: "sine-wave",
  name: "Sine wave",
  description: "Makes a sine wave at 440Hz",
  type: "component",
  component,
};

export default dspDefinition;
