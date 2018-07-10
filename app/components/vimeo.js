/*
* A promise based wrapper for the vimeo API
*/
class VimeoClient{
  constructor(quality='hls'){
    if(quality == null){
      console.warn('[Vimeo] you have to specifiy the quality parameter');
    }
    /*
    * Set the desired quality.
    * - 'hd'
    * - 'sd'
    * - 'hls'
    */
    this.selectedQuality = quality;

    //Props to be parsed from the API response
    this.type;
    this.fps;
    this.props = {};
    this.url;
    this.files;
  }
  requestVideo(vimeoVideoID){

    //Safeguard the request
    if(!vimeoVideoID){
      console.warn('[Client] Can not request a video without providing a video ID');
      return;
    }

    //The function returns a promise based on the request made inside
    return new Promise((resolve, reject)=>{
      //Use the fetch API (returns a promise) and assemble the complete request path - e.g http://myawesomeapp.com/video/vimeo_video_id
      fetch(`${window.location.protocol}//${window.location.host}/video/${vimeoVideoID}`).then(response=>{

        //Unpack the response and get the object back using .json() method from the fetch API
        response.json().then(obj=>{
          if(response.status === 200){

            //Save the file list of each request to a member object of the instance
            if(obj.play == null){
              reject('[Vimeo] no video found');
            }

            this.files = obj.play;

            if(obj.description){
              this.props = JSON.parse(obj.description);
            }

            if(this.selectedQuality == 'hls'){
              this.url = this.files.hls.link;
              this.type = 'application/x-mpegURL';
            } else if(this.selectedQuality == 'dash'){
              this.url = this.files.dash.link;
              console.log(this.url);
              this.type = 'application/x-mpegURL';
            } else {
              //Iterate over the file list and find the one that matchs our quality setting (e.g 'hd')
              for(let file of this.files.progressive){
                console.log(file);
                if(file.width === this.selectedQuality){

                  //Save the link
                  this.url = file.link;

                  //Save the type
                  this.type = file.type;

                  //Save the framerate
                  this.fps = file.fps;

                  //Fix the width and height based on the vimeo video sizes
                  this.props.textureWidth = file.width;
                  this.props.textureHeight = file.height;

                }
              }
            }


            //Resolve the promise and return the url for the video and the props object
            resolve({
              'url': this.url,
              'props': this.props,
              'type': this.type,
              'fps': this.fps
            });

          } else {
            reject(response.status);
          }
        })
      });
    });

  }
}

export default VimeoClient;
