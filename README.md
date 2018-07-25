<h1>Vimeo Depth Player</h1>

![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)  

![cover](https://github.com/vimeo/volumetric-player/blob/library-refactoring/docs/webvr_small.gif)  
A webVR volumetric video player that uses color-depth videos hosted on Vimeo. 
- [Getting started](#getting-started)
- [Features](#features)
- [Requirements](#requirements)
- [API](#api)
- [Development](#development)

# Getting started
Check out / remix our Glitch demos:
- [Playback](https://vimeo-depth-player-playback.glitch.me/)
- [Livestreaming (archived stream)](https://vimeo-volumetric-video-livestreaming.glitch.me)

To quickly get started you can download our demo assets [from here (playback)](https://vimeo.com/279527916) or [here (archived livestream)](https://vimeo.com/280565863) and upload them into your Vimeo account, copy video descriptions as well. Make sure you check out the [requirements section](#requirements).

> Note: In order to stream Vimeo videos, you will need direct video file access via the Vimeo API. Accessing video files via API is limited to Vimeo Pro and Business customers.

1. Download or clone the repository, `git clone https://github.com/vimeo/vimeo-depth-player.git`
2. Generate a token for your Vimeo account here and save the token into a `.env` file in the root folder of the repository.
```sh
VIMEO_TOKEN=asfa733240239qwerfhuasf
```
3. Install all dependencies by running `npm install` inside the repository folder
4. Run the server, `npm run start`
5. In the examples folder swap your volumetric Vimeo video id with the one provided in the `examples/playback.html`
```js
depthPlayer = new Vimeo.DepthPlayer('YOUR_VIDEO_ID');
```

# Features
### Adaptive Playback
![playback](https://github.com/vimeo/vimeo-depth-player/blob/library-refactoring/docs/playback.gif)  
The `Vimeo.DepthPlayer()` supports adaptive playback of volumetric video hosted on Vimeo. Currently, it supports volumetric captures made with [DepthKit](https://depthkit.tv) using the Combined-Per-Pixel export option. It recomended to store the `take.txt` contents in the video description for more accurate 3D reconstruction.

### Livestreaming
![livestreaming](https://github.com/vimeo/vimeo-depth-player/blob/library-refactoring/docs/livestreaming.gif)  
The `Vimeo.DepthPlayer()` also supports adaptive playback of live streamed volumetric video using [Vimeo Live](https://vimeo.com/live) and an Intel RealSense camera (D415/D435). In order to livestream volumetric video you can use our [Depth Viewer](http://github.com/vimeo/depth-viewer) that enables you to use Livestream Studio/OBS to stream an aligned color-depth video. 


# Requirements
* Requires a Pro [Vimeo account](https://vimeo.com) or higher. 
* [Node.js](https://nodejs.org)

# API
All the functionality is acsseable after instancing a Vimeo `DepthPlayer` in the following way
```js
var depthPlayer = new Vimeo.DepthPlayer('YOUR_VIDEO_ID');
```
Here is a list of all the parameter you can provide to the `Vimeo.DepthPlayer()` constructor:
1. `_vimeoVideoId` - The first parameter must be provided and describes the Vimeo video ID
2. `_videoQuality` - Default is `auto` which will try to establish an adaptive stream (i.e Dash stream), you can specifiy a fixed width by providing a number instead.
3. `_depthType` - An enum desciring the depth encoding type. Currently you can choose between `Vimeo.DepthType.DepthKit` or `Vimeo.DepthType.RealSense`.
4. `_depthStyle` - An enum desciring the depth rendering style. Default is `Vimeo.RenderStyle.Points`. Optionally you can use `Vimeo.RenderStyle.Mesh` or `Vimeo.RenderStyle.Wire`.
### Methods:
`depthPlayer.play()` - Play the volumetric video
`depthPlayer.stop()` - Pause playback and set the video time to 0
`depthPlayer.pause()` - Pause playback
`depthPlayer.setVolume(volume)` - Set the volume of the audio
`depthPlayer.setLoop(state)` - Controls the loop state
`depthPlayer.setPointSize(size)` - If rendering `Vimeo.RenderStyle.Points` controls the size of the points
`depthPlayer.setOpacity(opacity)` - Control the opacity of the 3D object
`depthPlayer.setLineWidth(width)` - If rendering `Vimeo.RenderStyle.Wire` controls the width of the wireframe
`depthPlayer.dispose()` - Get rid of the `depthPlayer` instance and clean up all resources

# Questions, help, and support
For questions and support, [ask on StackOverflow](https://stackoverflow.com/questions/ask/?tags=vimeo). If you found a bug, please file a [GitHub issue](https://github.com/vimeo/vimeo-depth-player/issues).

Make pull requests, file bug reports, and make feature requests via a [GitHub issue](https://github.com/vimeo/vimeo-depth-player/issues).

# Let's collaborate
Working on a cool video project? [Let's talk!](mailto:labs@vimeo.com)

# Thanks
Special thanks to [DepthKit](https://depthkit.tv) and [DepthKit.js](https://github.com/juniorxsound/DepthKit.js)
