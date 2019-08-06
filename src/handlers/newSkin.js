const pool = require('../database/db')
const newSkin = async function(req, res){
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
        res.send('File uploaded!');
    });
}

module.exports = newSkin