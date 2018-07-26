<h1 style="text-align:center">Vimeo Depth Player</h1>

<div style="text-align:center;">

<img src="https://raw.githubusercontent.com/vimeo/vimeo-depth-player/library-refactoring/docs/webvr_small.gif?token=AAJhwWgAm6TGq5tvMZS_8puOgjbKedDeks5bYxduwA%3D%3D" alt="A GIF of a volumetric WebVR demo" height="330" />

<span style="font-weight:bold;">A WebVR volumetric video player that uses color-depth based videos hosted on Vimeo.</span>

![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square) <a href="https://glitch.com/edit/#!/remix/vimeo-depth-player-playback" target="_blank">
  <img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix button" aria-label="remix" height="23">
</a>

</div>

# Overview
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Features](#features)
- [API](#api)
- [Development](#development)

# Requirements
* Requires a [Vimeo Pro account](https://vimeo.com) or higher. 
* [Node.js](https://nodejs.org)


# Getting started
If you're unfamiliar with setting up Node, the easiest way to get started is to just remix our demos on Glitch (click the GIFs).

<a href="https://vimeo-depth-player-playback.glitch.me/">
  <img alt="Demo" target="_blank" src="https://i.imgur.com/KB9D16o.gif" height="260" width="49%">
</a>
<a href="https://vimeo-volumetric-video-livestreaming.glitch.me">
  <img alt="Livestreaming demo" target="_blank" src="https://i.imgur.com/IO21VAX.gif" height="260" width="49%">
</a>

To quickly get started you can download our demo assets from [here](https://vimeo.com/279527916) (using a [Depthkit](https://depthkit.tv) produced asset)  or [here](https://vimeo.com/280565863) (our archived livestream using a IntelReal Sense camera) and upload them into your Vimeo account. Copy descriptions of the videos on Vimeo as well - it's our hacky way of storing config information. Make sure you check out the [requirements section](#requirements).

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

- [x] Supports DepthKit volumetric video hosted on Vimeo.
- [x] Supports adaptive video for fast video delivery and rendering (on supported devices).
- [x] Renders volumetric (color-depth) live streams using Vimeo Live
- [x] Supports streams captured with an Intel RealSense D415/D435
- [x] Utilizes adaptive streaming for for smooth video delivery and rendering
- [x] Tested with [Depth Viewer](http://github.com/vimeo/depth-viewer)

# API
All the functionality is acsseable after instancing a Vimeo `DepthPlayer` in the following way
```js
var depthPlayer = new Vimeo.DepthPlayer('YOUR_VIDEO_ID');
```
Here is a list of all the parameters you can provide to the `Vimeo.DepthPlayer()` constructor:
1. `_vimeoVideoId` (required) - The first parameter must be provided and describes the Vimeo video ID
2. `_videoQuality` - Default is `auto` which will try to establish an adaptive stream (i.e Dash stream), you can specifiy a fixed width by providing a number instead.
3. `_depthType` - An enum desciring the depth encoding type. Currently you can choose between `Vimeo.DepthType.DepthKit` or `Vimeo.DepthType.RealSense`.
4. `_depthStyle` - An enum desciring the depth rendering style. Default is `Vimeo.RenderStyle.Points`. Optionally you can use `Vimeo.RenderStyle.Mesh` or `Vimeo.RenderStyle.Wire`.

### Depth player methods

- `play()` - Play the volumetric video
- `stop()` - Pause playback and set the video time to 0
- `pause()` - Pause playback
- `setVolume(volume)` - Set the volume of the audio
- `setLoop(state)` - Controls the loop state
- `setPointSize(size)` - If rendering `Vimeo.RenderStyle.Points` controls the size of the points
- `setOpacity(opacity)` - Control the opacity of the 3D object
- `setLineWidth(width)` - If rendering `Vimeo.RenderStyle.Wire` controls the width of the wireframe
- `dispose()` - Get rid of the `depthPlayer` instance and clean up all resources

# Questions, help, and support
For questions and support, [ask on StackOverflow](https://stackoverflow.com/questions/ask/?tags=vimeo). If you found a bug, please file a [GitHub issue](https://github.com/vimeo/vimeo-depth-player/issues).

Make pull requests, file bug reports, and make feature requests via a [GitHub issue](https://github.com/vimeo/vimeo-depth-player/issues).

# Let's collaborate
Working on a cool video project? [Let's talk!](mailto:labs@vimeo.com)

# Thanks
Special thanks to [three.js](https://github.com/mrdoob/three.js), [DepthKit](https://depthkit.tv) and [DepthKit.js](https://github.com/juniorxsound/DepthKit.js)
