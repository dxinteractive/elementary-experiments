import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./css/base.css";
import classes from "./dev.module.css";

import { all } from "./dsp-definitions/all";
import { Output, PlotPanel } from "./offline-visualisations";
import { useWindowSize } from "./utils/use-window-size";
import { touchStart } from "mosfez-faust/touch-start";

import {
  HashRouter,
  Routes,
  Route,
  Outlet,
  Link,
  useParams,
} from "react-router-dom";
import { DspDefinition } from "./types";
import { core, coreState, startElementary } from "./elementary-web-renderer";
import { useSnapshot } from "valtio";
import { el } from "@elemaudio/core";

const liveAudioContext = new AudioContext();
touchStart(liveAudioContext);

startElementary(liveAudioContext);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<List />} />
          <Route path=":id" element={<DspRoute />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

function Main() {
  const { ready } = useSnapshot(coreState);
  if (!ready) {
    return <div className={classes.main}>loading elementary...</div>;
  }

  return (
    <div className={classes.main}>
      <Outlet />
      <div className={classes.footer}>
        <FooterLink href="https://www.elementary.audio/docs">
          Elementary docs
        </FooterLink>
        <FooterLink href="https://www.elementary.audio/docs/reference">
          Elementary library
        </FooterLink>
        <FooterLink href="https://discord.com/channels/826071713426178078/834787928688689172">
          Elementary discord
        </FooterLink>
      </div>
    </div>
  );
}

type FooterLinkProps = {
  children: React.ReactNode;
  href: string;
};

function FooterLink(props: FooterLinkProps) {
  return <a className={classes.link} target="_blank" {...props} />;
}

function List() {
  const silence = el.const({ value: 0 });
  core.render(silence, silence);

  return (
    <>
      <ListHeader>
        Elementary and WebAudio API sketches -{" "}
        <a
          className={classes.link}
          href="https://github.com/dxinteractive/elementary-experiments"
        >
          github repo
        </a>
      </ListHeader>
      <ol className={classes.list}>
        {all.map((dsp) => {
          return (
            <li className={classes.listItem} key={dsp.id}>
              <Link to={`/${dsp.id}`}>{dsp.name}</Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}

type ListHeaderProps = {
  children: React.ReactNode;
};

function ListHeader(props: ListHeaderProps) {
  return (
    <header className={classes.dspHeader}>
      <div className={classes.dspHeaderTitle}>{props.children}</div>
    </header>
  );
}

function DspRoute() {
  const { id } = useParams();
  const dspDefinition = all.find((dspDefinition) => dspDefinition.id === id);

  if (!dspDefinition) {
    return <DspHeader>Dsp "{id}" not found</DspHeader>;
  }

  return <Dsp dspDefinition={dspDefinition} />;
}

type DspProps = {
  dspDefinition: DspDefinition;
};

function Dsp(props: DspProps) {
  const { dspDefinition } = props;
  const { name, description, filename, Component } = dspDefinition;

  const [offlineResultToPlot, setOfflineResultToPlot] = useState<Output[]>([]);
  const renderResults = (results: Output[]) => {
    setOfflineResultToPlot((res) => res.concat(results));
  };

  const { width } = useWindowSize();
  const sourceUrl = `https://github.com/dxinteractive/elementary-experiments/blob/main/src/dsp-definitions/${filename}`;

  return (
    <>
      <DspHeader>
        <strong>{name}</strong> - {description}
        <br />
        <a className={classes.link} href={sourceUrl}>
          source code
        </a>
      </DspHeader>
      <Component
        audioContext={liveAudioContext}
        renderResults={renderResults}
      />
      {offlineResultToPlot && offlineResultToPlot.length > 0 && (
        <div className={classes.dspContent}>
          <PlotPanel
            name={name}
            offlineResult={offlineResultToPlot}
            width={width - 36}
            height={200}
            liveAudioContext={liveAudioContext}
          />
        </div>
      )}
    </>
  );
}

type DspHeaderProps = {
  children: React.ReactNode;
};

function DspHeader(props: DspHeaderProps) {
  return (
    <header className={classes.dspHeader}>
      <div className={classes.dspHeaderTitle}>{props.children}</div>
      <div className={classes.dspHeaderBack}>
        <Link to="/">back</Link>
      </div>
    </header>
  );
}
