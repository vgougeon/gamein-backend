const pool = require('../database/db')
require('../services/validation')();
require('../services/compress')();
const newSkin = async function(req, res){
    const user = validation(req)
    if(!user){ return false }
    
    if (req.files !== undefined && Object.keys(req.files).length == 0) {
        return false
    }
    const [skin] = await pool.execute(`
    INSERT INTO skins VALUES()
    `);

    let gameId = req.body.gameId
    await pool.execute(`
    INSERT INTO skins_media (skin_id, media_id) VALUES (${skin.insertId}, ${gameId})
    `);

    req.files.skin.mv(`/var/www/assets/skin/${skin.insertId}.jpg`, function(err) {
        if (err)
          return res.status(500).send(err);
    });

    compress(req.files.skin, `/var/www/assets/skin/${skin.insertId}.jpg`)

    res.status(200).send('success')
}

module.exports = newSkin