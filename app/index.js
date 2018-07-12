//Import three.js
import * as THREE from 'three';

import DepthKit from './components/depthkit';

import Scene from './components/scene';

import VimeoClient from './components/vimeo';

import DepthStream from './components/depthstream';

import DepthPlayer from './components/depthplayer';

import Type from './components/type';

import Style from './components/style';



/*
* Attach all the functionality to the window
* The specific code related to each page will
* be written in the specific view (e.g views/depthkit.html)
* ----------------------------------------------------------
* TODO - Package the functionality into a library that could
* easily be distributed and installed
*/

window.THREE = THREE;

// Cleaner solution to avoid trashing the window object for now
const Sandbox = {
  'DepthStream': DepthStream,
  'DepthKit': DepthKit,
  'Scene': Scene,
  'VimeoClient': VimeoClient,
  'DepthPlayer': DepthPlayer,
  'Style': Style,
  'Type': Type
}

window.Sandbox = Sandbox;
