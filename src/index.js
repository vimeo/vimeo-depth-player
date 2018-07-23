import API from './components/vimeo';
import DepthPlayer from './components/depth-player';
import DepthType from './components/depth-type';
import RenderStyle from './components/render-';
import Util from './components/util';

/*
 * Everything lives in the Vimeo namespace and is only
 * Attached to the window if THREE (three.js) exists
 */
const Vimeo = {
  'API': API,
  'DepthPlayer': DepthPlayer,
  'RenderStyle': RenderStyle, //problem!
  'DepthType': DepthType, //problem!
  'Util': Util
}

if (window.THREE) {
  window.Vimeo = Vimeo;
} else {
  console.warn('[Depth Player] three.js was not found, did you forget to include it?');
}
