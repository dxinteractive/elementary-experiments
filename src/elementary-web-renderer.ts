import { el, NodeRepr_t } from "@elemaudio/core";
import WebRenderer from "@elemaudio/web-renderer";
import { useEffect } from "react";
import { proxy, useSnapshot } from "valtio";

const core = new WebRenderer();
const coreState = proxy({
  ready: false,
});

const OUTPUT_CHANNEL_COUNT = 2;

const silence = el.const({ value: 0 });

export async function startElementary(audioContext: AudioContext) {
  const loaded = new Promise((r) => core.on("load", r));
  const initialized = core.initialize(audioContext, {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [OUTPUT_CHANNEL_COUNT],
  });

  const [node] = await Promise.all([initialized, loaded]);
  node.connect(audioContext.destination);
  coreState.ready = true;
  return core;
}

export type RenderElementaryProps = {
  node: number | NodeRepr_t;
};

export function RenderElementary({ node }: RenderElementaryProps) {
  const { ready } = useSnapshot(coreState);
  useEffect(() => {
    if (!ready) return;

    console.log("rendering new node", node);
    core.render(node, node);
    return () => {
      console.log("rendering silence");
      core.render(silence, silence);
    };
  }, [node, updateVirtualFileSystem, ready]);

  return null;
}

export type VirtualFileSystemObject = Record<
  string,
  Float32Array | Array<number>
>;

export function updateVirtualFileSystem(obj: VirtualFileSystemObject) {
  console.log("updating virtual file system", updateVirtualFileSystem);
  core.updateVirtualFileSystem(obj);
}
