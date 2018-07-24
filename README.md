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
To quickly get started you can download our demo assets [from here](https://labs.vimeo.com/cdn/volumetric/demo-assets.zip) and upload them into your Vimeo account, copy video descriptions as well. Make sure you check out the [requirements section](#requirements).
1. Download or clone the repository, `git clone https://github.com/vimeo/vimeo-depth-player.git`
2. Generate a token for your Vimeo account here and save the token into a `.env` file in the root folder of the repository.
```sh
VIMEO_TOKEN=asfa733240239qwerfhuasf
```
3. Install all dependencies by running `npm install` inside the repository folder
4. Run the server, `npm run start`
5. In the examples folder swap your volumetric Vimeo video id with the one provided
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


# Questions, help, and support
For questions and support, [ask on StackOverflow](https://stackoverflow.com/questions/ask/?tags=vimeo). If you found a bug, please file a [GitHub issue](https://github.com/vimeo/unity-vimeo-player/issues).

Make pull requests, file bug reports, and make feature requests via a [GitHub issue](https://github.com/vimeo/unity-vimeo-player/issues).

# Let's collaborate
Working on a cool video project? [Let's talk!](mailto:labs@vimeo.com)

# Thanks
