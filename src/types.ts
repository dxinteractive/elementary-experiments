import React from "react";

export type RenderResultsOutput = {
  name: string;
  output: Float32Array[];
};

export type RenderResults = (outputs: RenderResultsOutput[]) => void;

export type DspComponentProps = {
  audioContext: AudioContext;
  renderResults: RenderResults;
};

export type DspDefinition = {
  id: string;
  name: string;
  description: string;
  Component: React.FC<DspComponentProps>;
};
