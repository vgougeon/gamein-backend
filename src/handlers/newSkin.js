const pool = require('../database/db')
const newSkin = async function(req, res){
    if (req.files !== undefined && Object.keys(req.files).length == 0) {
        return false
    }
    console.log(req.files)
    req.files.skin.mv('/var/www/assets/1.jpg', function(err) {
        if (err)
          return res.status(500).send(err);
        res.send('File uploaded!');
    });
}

module.exports = newSkin