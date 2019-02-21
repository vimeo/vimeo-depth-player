<h1 align="center">Vimeo Depth Player</h1>
<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
  <img src="https://app.codeship.com/projects/9ce7c020-7326-0136-9217-52081b953558/status?branch=master" alt="Codeship Status" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome">
 <img src="https://badge.glitch.me/vimeo-depth-player-playback" alt="Glitch Examples status" />
</p>
<h4 align="center">A WebVR volumetric video renderer that uses color-depth based videos hosted on Vimeo.</h4>
<p align="center">This repository consists of tools and demos presetned at the Volumetric Filmmaking meetup at NYC.<br> <a href="https://vimeo-depth-player-playback.glitch.me/">Check out our demo</a> and our complimentary <a href="https://github.com/vimeo/vimeo-threejs-player">three.js player repository</a>.</p>

## Examples
<a href="https://vimeo-depth-player-playback.glitch.me/"><img alt="Demo" target="_blank" src="https://i.imgur.com/KB9D16o.gif" height="270" width="49%"></a>
<a href="https://vimeo-volumetric-video-livestreaming.glitch.me"><img alt="Livestreaming demo" target="_blank" src="https://i.imgur.com/IO21VAX.gif" height="270" width="49%"></a>
<i>Check out our <a href="https://vimeo-depth-player-playback.glitch.me/">volumetric playback</a> and <a href="https://vimeo-volumetric-video-livestreaming.glitch.me">volumetric live-streaming</a> demos.</i>

## Features
📼 **Render volumetric video**: The plugin lets you render volumetric video hosted on Vimeo

🏋🏿‍ **Let us do the heavy lifting**: stream multiple resolutions including adaptive video on supported platforms for best performance and video quality using our [three.js player](https://github.com/vimeo/vimeo-threejs-player)

📱 **Works everywhere**: works on phones, tablets, laptops, computers, VR headsets and even underwater

## Usage
To start playing and streaming video now, remix the Glitch example:

<a href="https://vimeo-depth-player-playback.glitch.me/">
<img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix-button.svg?1504724691606" alt="Glitch remix badge" aria-label="remix" width="124" />
</a>

[Upload your volumetric video to Vimeo](https://vimeo.com/upload). If you are using Depthkit footage, remember to put the metadata in the video description.

Next step is to generate your own Vimeo API token. [Generate the token](https://vimeo-authy.herokuapp.com/auth/vimeo/webgl), and then copy it and paste it into the *.env* in Glitch.

Almost done, go to the example javascript file under `client.js`
 and change the video id in line 40 to your Vimeo video id. It should look like
 ```js
  // Create a new Vimeo Player and set the video
  vimeoPlayer = new Vimeo.Player(your_vimeo_video_id, {
    autoplay: false,
    autoload: true
  });
 ```

For our full three.js player documentation [visit this page](https://github.com/vimeo/vimeo-threejs-player)

> Streaming Vimeo videos requires video file access via the Vimeo API. Accessing video files is limited to [Vimeo Pro and Business](https://vimeo.com/upgrade) customers.

## Questions
For questions and support, ask on [StackOverflow](https://stackoverflow.com/questions/ask/?tags=vimeo)

## Stay in Touch
[Join our newsletter](https://vimeo.us6.list-manage.com/subscribe?u=a3cca16f9d09cecb87db4be05&id=28000dad3e) for more updates, or visit the [Creator Labs website](https://labs.vimeo.com) to learn more.

## License
This software is free software and is distributed under an [MIT License](LICENSE).

## Thanks
Special thanks to [three.js](https://github.com/mrdoob/three.js), [Depthkit](https://depthkit.tv) and [Depthkit.js](https://github.com/juniorxsound/DepthKit.js)
