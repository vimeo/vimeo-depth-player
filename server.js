// Vimeo.js
const Vimeo = require('vimeo').Vimeo;

// Express.js
const express = require('express');
const app = express();

// ejs
const ejs = require('ejs');

// Render engine for the express server
app.use(express.static('assets'));
app.use(express.static('dist'));
app.engine('.html', ejs.__express);
app.set('view-engine', 'html');
app.set('views', __dirname + '/examples');

// CORS headers
app.use(function(req, res, next) {
  console.log(`[Server] A ${req.method} request was made to ${req.url}`);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*
* Vimeo token for local development is saved in a .env file
* For deployment make sure to store it in an enviorment
* variable called VIMEO_TOKEN=4trwegfudsbg4783724343
*/
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
  if(process.env.VIMEO_TOKEN){
      console.log('[Server] enviorment variables loaded from .env file 💪🏻');
  } else {
    console.log('[Server] could not load the Vimeo token, make sure you have a .env file or enviorment variable with the token');
    return;
  }

}

app.get('/playback', (request, response) => {
  response.render('playback.html');
});

app.get('/resolution', (request, response) => {
  response.render('resolution.html');
});

app.get('/live', (request, response) => {
  response.render('live.html');
});

// The route for getting videos from the vimeo API
// TODO: restrict requests to the server's domain
app.get('/video/:id', (request, response) => {
  // Create an API instance using your VIMEO_TOKEN from your .env file
  let api = new Vimeo(null, null, process.env.VIMEO_TOKEN);

  api.request({
    method: 'GET',
    path: `/videos/${request.params.id}`,
    headers: { 'Accept': 'application/vnd.vimeo.*+json;version=3.4' },
  },
  function(error, body, status_code, headers) {
    if (error) {
      response.status(500).send(error);
      console.log('[Server] ' + error);
    }
    else {
      if (body["play"] == null) {
        response.status(401).send({ error: "You don't have access to this video's files." });
        return;
      }

      // Sort the resolutions from highest to lowest
      if (body["play"]["progressive"]) {
        body["play"]["progressive"] = body["play"]["progressive"].sort(function(a, b) {
          if (parseInt(a['height']) > parseInt(b['height'])) return -1;
          return 1;
        });
      }

      // Unfurl the Live links to hack around CORS issues
      if (body.live && body.live.status == "streaming") {
        var sync_req = require('sync-request');

        body.play.dash.link = sync_req('GET', body.play.dash.link).url;
        body.play.hls.link  = sync_req('GET', body.play.hls.link).url;
      }

      response.status(200).send(body);
    }
  });

});

const listener = app.listen(process.env.PORT, () => {
  console.log(`[Server] Running on port: ${listener.address().port} 🚢`);
});
