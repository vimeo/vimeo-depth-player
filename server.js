//Import the vimeo.js library
const Vimeo = require('vimeo').Vimeo;

// Import the express library and create an express app
const express = require('express');
const app = express();

//Expose the public folder to the client
app.use(express.static('public'));

//Implement CORS headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // "Accept", "application/vnd.vimeo.*+json;version=" + apiVersion
  res.header("Accept", "application/vnd.vimeo.*+json;version=3.4");
  next();
});

// If working locally load the enviorment variables which are inside the .env file
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').load();
  console.log('[Server] enviorment variables loaded from .env file 💪🏻');
}

/*
* Routes
* - /
* - /depthkit
* - /live
*/
app.get('/', (request, response)=>{
  console.log(`[Server] A ${request.method} request was made to ${request.url}`);
  response.sendFile(`${__dirname}/views/index.html`);
});

app.get('/depthkit', (request, response)=>{
  console.log(`[Server] A ${request.method} request was made to ${request.url}`);
  response.sendFile(`${__dirname}/views/depthkit.html`);
});

app.get('/live', (request, response)=>{
  console.log(`[Server] A ${request.method} request was made to ${request.url}`);
  response.sendFile(`${__dirname}/views/live.html`);
});

// The route for getting videos from the vimeo API
app.get('/video/:id', (request, response) => {

  console.log(`[Server] A ${request.method} request was made to ${request.url}`);

  //Create an API instance using your key
  let api = new Vimeo(null, null, process.env.VIMEO_TOKEN);

  //Make a requet
  api.request({
    method: 'GET',
    path: `/videos/${request.params.id}`,
  }, function(error, body, status_code, headers) {

    if (error) {
      response.status(500).send(error);
      console.log('[Server] ' + error);
    }
    else {
      // console.log(body.files);
      if (body["files"] == null && body["play"] == null) {
        response.status(401).send({ error: "You don't have access to this video's files."});
        return;
      }

      var version = 1;
      if (body['metadata']['connections'] && body['metadata']['connections']['versions']) {
        version = body['metadata']['connections']['versions']['total'];
      }

      // Prep the files to include the correct type and exclude uncessary files
      if (body["files"] != null) {
        body["files"] = body["files"].map(function(file, i) {
          if (file['quality'] == 'hls') {
            file['type'] = 'application/x-mpegurl';
          }
          if (file['quality'] == 'source') {
            return;
          }

          file['link'] = file['link'].replace(/^http:/, 'https:') + "&v=" + version;

          return file;
        }).sort(function(a, b) {
          if (parseInt(a['height']) > parseInt(b['height'])) return -1;
          return 1;
        });
      }

      response.status(200).send(body);
    }
  });

});

const listener = app.listen(process.env.PORT, () => {
  console.log(`[Server] Running on port: ${listener.address().port} 🚢`);
});
