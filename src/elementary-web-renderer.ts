import WebRenderer from "@elemaudio/web-renderer";
import { proxy } from "valtio";

export const core = new WebRenderer();
export const coreState = proxy({
  ready: false,
});
export let node: AudioNode | undefined;

const OUTPUT_CHANNEL_COUNT = 2;

export async function startElementary(audioContext: AudioContext) {
  const loaded = new Promise((r) => core.on("load", r));
  const initialized = core.initialize(audioContext, {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [OUTPUT_CHANNEL_COUNT],
  });

  const [newNode] = await Promise.all([initialized, loaded]);
  newNode.connect(audioContext.destination);
  node = newNode;
  coreState.ready = true;
  return core;
}

export type VirtualFileSystemObject = Record<
  string,
  Float32Array | Array<number>
>;

export function updateVirtualFileSystem(obj: VirtualFileSystemObject) {
  console.log("updating virtual file system", updateVirtualFileSystem);
  core.updateVirtualFileSystem(obj);
}
