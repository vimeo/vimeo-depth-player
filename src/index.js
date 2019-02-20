import DepthRenderer from './components/depth-renderer'
import DepthType from './components/depth-type'
import RenderStyle from './components/render-style'

if (window.THREE) {
  if (window.Vimeo) {
    window.Vimeo['DepthRenderer'] = DepthRenderer
    window.Vimeo['DepthType'] = DepthType
    window.Vimeo['RenderStyle'] = RenderStyle
  } else {
    window.Vimeo = {
      'DepthRenderer': DepthRenderer,
      'DepthType': DepthType,
      'RenderStyle': RenderStyle
    }
  }
} else {
  console.warn('[Vimep DepthRenderer] three.js was not found, did you forget to include it?')
}
