const pool = require('../database/db')
const getGame = async function(req, res){
    if(req.query.game === undefined || isNaN(req.query.game)){   
        return res.send(500)
    }
    const [{0: game}] = await pool.execute(`
    SELECT id, name, year(release_date) as release_year FROM media WHERE id = ${req.query.game}
    `)
    
    const [consoles] = await pool.execute(`
    SELECT c.* FROM media_consoles mc INNER JOIN consoles c ON mc.console_id = c.id WHERE mc.media_id = ${req.query.game}
    `)

    const [skins] = await pool.execute(`
    SELECT s.id FROM media m INNER JOIN skins_media lnk ON lnk.media_id = m.id INNER JOIN skins s ON s.id = lnk.skin_id WHERE m.id = ${req.query.game} ORDER BY s.id DESC
    `)
    const data = {
        ...game,
        console: consoles,
        skins: skins
    }
    res.send(data)
}

module.exports = getGame