//Import the vimeo.js library
const Vimeo = require('vimeo').Vimeo;

// Import the express library and create an express app
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors')
const app = express();


// Render engine setup
var path = require('path');
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

//Setup cors
app.use(cors());

app.use(function(req, res, next) {
  console.log(`[Server] A ${req.method} request was made to ${req.url}`);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// If working locally load the enviorment variables which are inside the .env file
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
  console.log('[Server] enviorment variables loaded from .env file 💪🏻');
}

/*
* Public Routes
* - /
* - /experiments    # homepage
* - /experiments/:project
* - /experiments/:project/:video_id
* - /:video_id
*/

app.get('/', (request, response) => {
  response.render('index', { layout: false });
});

app.get('/experiments', (request, response) => {
  response.render('experiments');
});

app.get('/experiments/:project', (request, response) => {
  response.render('experiments/' + request.params.project, { video_id: null });
});

app.get('/experiments/:project/:video_id', (request, response) => {
  response.render('experiments/' + request.params.project, { video_id: request.params.video_id });
});

app.get('/:video_id', (request, response) => {
  response.render('video', { video_id: request.params.video_id });
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

      // Unfurl the Live links to hack around CORS issues
      if (body.live && body.live.status == "streaming") {
        var sync_req = require('sync-request');

        body.play.dash.link = sync_req('GET', body.play.dash.link).url;
        body.play.hls.link = sync_req('GET', body.play.hls.link).url;
      }

      response.status(200).send(body);
    }
  });

});

const listener = app.listen(process.env.PORT, () => {
  console.log(`[Server] Running on port: ${listener.address().port} 🚢`);
});
