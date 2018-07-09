//Import three.js
import * as THREE from 'three';

import DepthKit from './components/depthkit';

import Scene from './components/scene';

import VimeoClient from './components/vimeo';

import DepthStream from './components/depthstream';



/*
* Attach all the functionality to the window
* The specific code related to each page will
* be written in the specific view (e.g views/depthkit.html)
* ----------------------------------------------------------
* TODO - Package the functionality into a library that could
* easily be distributed and installed
*/
window.DepthStream = DepthStream;
window.DepthKit = DepthKit;
window.THREE = THREE;
window.Scene = Scene;
window.VimeoClient = VimeoClient;
