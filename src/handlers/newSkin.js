const pool = require('../database/db')
const socketServer = require('../classes/socketServer')
const exp = require('../config/experience.json')
const log = require('../services/logging')
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
    try {
        await req.files.skin.mv(`/var/www/assets/skin/${skin.insertId}.jpg`)
    }
    catch(err) {
        log.info("newSkin.js", "ERROR: file compress failed...")
        console.error(err)
        return res.status(500).send("Server error");
    }
    
    try {
        await compress(req.files.skin, `/var/www/assets/skin/${skin.insertId}.jpg`)
    }
    catch(err) {
        log.info("newSkin.js", "ERROR: file compress failed...")
        return res.status(500).send("Server error");
    }

    await pool.execute(`
    INSERT INTO skins_media (skin_id, media_id) VALUES (${skin.insertId}, ${gameId})
    `);

    socketServer.getClients(user.id)
    .forEach((socketClient) => {
        socketClient.addXp(exp['new-skin'].xp, "new-skin")
    })

    return res.status(200).send('success')
}

module.exports = newSkin