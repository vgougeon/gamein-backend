const pool = require('../database/db')
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
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

    req.files.skin.mv(`./${skin.insertId}.jpg`, function(err) {
        if (err)
          return res.status(500).send(err);
        res.send('File uploaded!');
    });

    if(req.files.skin.size > 250000){
        let quality = Math.floor(req.files.skin.size  * (-0.0000666) + 100)
        if(quality >= 95) quality = 95
        if(quality <= 30) quality = 30
        await imagemin([`./${skin.insertId}.jpg`], {
            destination: './test',
            plugins: [
                imageminMozjpeg({
                    quality: quality
                })
            ]
        });
    }
}

module.exports = newSkin