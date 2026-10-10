import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {LabStockFilm, SuhuLogFilm, BdrsFilm} from './Scenes';
const Root=()=> <>
 <Composition id="LabStock" component={LabStockFilm} durationInFrames={480} fps={30} width={1920} height={1080}/>
 <Composition id="SuhuLog" component={SuhuLogFilm} durationInFrames={480} fps={30} width={1920} height={1080}/>
 <Composition id="BDRS" component={BdrsFilm} durationInFrames={480} fps={30} width={1920} height={1080}/>
</>;
registerRoot(Root);
