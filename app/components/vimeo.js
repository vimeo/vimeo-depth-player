/*
* A promise based wrapper for the vimeo API
*/
class VimeoClient{
  constructor(quality='hd'){

    /*
    * Set the desired quality.
    * - 'hd'
    * - 'sd'
    * - 'hls'
    */
    this.selectedQuality = quality.toLowerCase();

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
            this.files = obj.files;

            // if(obj.description){
            //   this.props = JSON.parse(obj.description);
            // } else {
            //   //TODO Find a better way to do this!
            //   this.props.textureWidth = 640;
            //   this.props.textureHeight = 960;
            // }

            //Iterate over the file list and find the one that matchs our quality setting (e.g 'hd')
            for(let file of this.files){
              if(file.quality === this.selectedQuality){

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
