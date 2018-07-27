<h1 align="center">Vimeo Depth Player</h1>
<p align="center">
<img src="https://i.imgur.com/xuXsLJC.gif" alt="A GIF of a volumetric WebVR demo" height="330" />
</p>

<h4 align="center">A WebVR volumetric video player that uses color-depth based videos hosted on Vimeo.</h4>
<p align="center">This repository consists of tools and demos presetned at the Volumetric Filmmaking meetup at NYC.<br> Watch the <a href="https://vimeo.com/280815263#t=7836s">live-stream from the meetup</a>, or checkout the <a href="https://github.com/vimeo/vimeo-depth-viewer">Depth Viewer repository</a>.</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
  <img src="https://app.codeship.com/projects/9ce7c020-7326-0136-9217-52081b953558/status?branch=master" alt="Codeship Status" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome">
  <a href="https://glitch.com/edit/#!/remix/vimeo-depth-player-playback">
    <img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix button" aria-label="remix" height="23" alt="Glitch">
  </a>
</p>


# Overview
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Features](#features)
- [API](#api)

# Requirements
* Requires a [Vimeo Pro account](https://vimeo.com) or higher. 
* [Node.js](https://nodejs.org)


# Getting started
<a href="https://vimeo-depth-player-playback.glitch.me/">
  <img alt="Demo" target="_blank" src="https://i.imgur.com/KB9D16o.gif" height="270" width="49%">
</a>
<a href="https://vimeo-volumetric-video-livestreaming.glitch.me">
  <img alt="Livestreaming demo" target="_blank" src="https://i.imgur.com/IO21VAX.gif" height="270" width="49%">
</a>

### Upload a depth video
Make sure you check out the [requirements](#requirements) before starting.

First you'll need a video to test with on your Vimeo account. You can download one of the following demo videos:
* [DepthKit produced asset](https://vimeo.com/279527916) 
* [Archived livestream using a IntelReal Sense camera](https://vimeo.com/280565863) 

[Upload](https://vimeo.com/upload) them into your Vimeo account. Copy the description of the video on Vimeo as well - it's our hacky way of storing JSON config information. 

> Note: In order to stream Vimeo videos, you will need direct video file access via the Vimeo API. Accessing video files via API is limited to Vimeo Pro and Business customers.

### Glitch setup
If you're unfamiliar with setting up Node, the easiest way to get started is to just remix our demos on Glitch (click the GIFs above).

1. [Click here](https://glitch.com/edit/#!/remix/vimeo-depth-player-playback) to Remix the demo on Glitch
2. We will need to use the Vimeo API so that we can grab the video files directly for WebGL to use. To make your life easy, we [made this handy link which will generate the token for you](https://vimeo-authy.herokuapp.com/auth/vimeo/webgl). Once you have authorized the app, it will give you a token so you can paste into the `.env` file. If you're running this locally, create a `.env` file in your root folder. Your `.env` file should now look something like this:
```
VIMEO_TOKEN=406cea4d4xxxxxxxxxxe437756d036f5
```
3. In the examples folder swap your volumetric Vimeo video id with the one provided in the `examples/demo.html`
```js
depthPlayer = new Vimeo.DepthPlayer('YOUR_VIDEO_ID');
```

### Node.js setup
1. Download or clone the repository, `git clone https://github.com/vimeo/vimeo-depth-player.git`
2. Generate a token for your Vimeo account here and save the token into a `.env` file in the root folder of the repository.
```sh
VIMEO_TOKEN=asfa733240239qwerfhuasf
```
3. Install all dependencies by running `npm install` inside the repository folder
4. Run the server, `npm run start`
5. In the examples folder swap your volumetric Vimeo video id with the one provided in the `examples/demo.html`
```js
depthPlayer = new Vimeo.DepthPlayer('YOUR_VIDEO_ID');
```

### Example demos
* `examples/demo.html` - A simple volumetric demo that also includes a background 3D model.
* `examples/live.html` - Almost identical to `demo.html` just different assets. We included this just to show what we used in our [livestreaming volumetric demo](https://vimeo.com/280815263#t=8395s).
* `examples/resolution.html` - This shows you how to select different video resolutions for playback.

# Features

- [x] Supports DepthKit volumetric video hosted on Vimeo.
- [x] Supports adaptive video (HLS/DASH) for fast video delivery and rendering (on supported browsers and mobile devices).
- [x] Leverage our [Depth Viewer](http://github.com/vimeo/depth-viewer) to livestream volumetric video (color-depth) using Vimeo Live
- [x] Supports streams captured with an Intel RealSense D415/D435

# API
All the functionality is acsseable after instancing a Vimeo `DepthPlayer` in the following way
```js
var depthPlayer = new Vimeo.DepthPlayer('YOUR_VIDEO_ID');
```
Here is a list of all the parameters you can provide to the `Vimeo.DepthPlayer()` constructor:
```js
Vimeo.DepthPlayer(
  _vimeoVideoId, // (required) - The first parameter must be provided and describes the Vimeo video ID
  _videoQuality, // Default is `auto` which will try to establish an adaptive stream, you can specifiy a fixed width by providing a number instead.
  _depthType, // An enum desciring the depth encoding type. Currently you can choose between `Vimeo.DepthType.DepthKit` or `Vimeo.DepthType.RealSense`.
  _depthStyle,  // An enum desciring the depth rendering style. Default is `Vimeo.RenderStyle.Points`. Optionally you can use `Vimeo.RenderStyle.Mesh` or `Vimeo.RenderStyle.Wire`.
);
```

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
