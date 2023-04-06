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
import { startElementary } from "./elementary-web-renderer";

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
  return (
    <div className={classes.main}>
      <Outlet />
      <div className={classes.footer}>
        <FooterLink href="https://faustdoc.grame.fr/manual/syntax/">
          Faust syntax
        </FooterLink>
        <FooterLink href="https://faustlibraries.grame.fr/">
          Faust libraries
        </FooterLink>
        <FooterLink href="https://faustide.grame.fr/">Faust IDE</FooterLink>
        <FooterLink href="https://www.rebeltech.org/patch-library/patches/my-patches/">
          OWL patches
        </FooterLink>
        <FooterLink href="https://www.openwarelab.org/Tools/firmware.html">
          OWL Firmware
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
  const { name, description, Component } = dspDefinition;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const dsp = dspDefinition.dsp;

  const [offlineResultToPlot, setOfflineResultToPlot] = useState<Output[]>([]);
  const renderResults = (results: Output[]) => {
    setOfflineResultToPlot((res) => res.concat(results));
  };

  const { width } = useWindowSize();

  return (
    <>
      <DspHeader>
        <strong>{name}</strong> - {description}
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
      <div className={classes.dspContent}>
        {dsp && <pre className={classes.dspPre}>{dsp}</pre>}
      </div>
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
