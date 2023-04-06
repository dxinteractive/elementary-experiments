import { useEffect, useState } from "react";
import { VirtualFileSystemObject } from "./elementary-web-renderer";

export function fetchFile(url: string) {
  if (import.meta.env.MODE === "deployed") {
    url = `${import.meta.env.BASE_URL}/${url}`;
  }
  return fetch(url);
}

const cache = new Map<string, AudioBuffer>();

export async function fetchSoundFile(audioContext: AudioContext, path: string) {
  const cached = cache.get(path);
  if (cached) return cached;

  const response = await fetchFile(path);
  if (!response.ok) {
    throw new Error(`Could not fetch sound file "${path}"`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const result = await audioContext.decodeAudioData(arrayBuffer);
  cache.set(path, result);
  return result;
}

export async function fetchSoundFiles(
  audioContext: AudioContext,
  paths: string[]
): Promise<VirtualFileSystemObject> {
  const buffers = await Promise.all(
    paths.map((path) => fetchSoundFile(audioContext, path))
  );
  const soundFiles: Record<string, Float32Array> = {};
  paths.forEach((path, i) => {
    soundFiles[path] = buffers[i].getChannelData(0);
  });
  return soundFiles;
}

export function useFetchSoundFiles(
  audioContext: AudioContext,
  paths: string[]
) {
  const [soundFiles, setSoundFiles] = useState<
    undefined | VirtualFileSystemObject
  >();

  useEffect(() => {
    fetchSoundFiles(audioContext, paths).then((files) => {
      setSoundFiles(files);
    });
  }, [audioContext, paths]);

  return soundFiles;
}
