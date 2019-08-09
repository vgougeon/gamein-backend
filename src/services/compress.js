const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')

module.exports = function() {
  this.compress = async function(file, path){
    let folder = path.substr(0, path.lastIndexOf("/") + 1);
    if(file.size > 250000){
      let quality = Math.floor(file.size  * (-0.0000666) + 100)
      if(quality >= 95) quality = 95
      if(quality <= 30) quality = 30
      await imagemin([path], {
          destination: folder,
          plugins: [
              imageminMozjpeg({
                  quality: quality
              })
          ]
      });
    }
  }
}