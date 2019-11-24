const pool = require('../database/db')
require('../services/validation')();
const getGameOst = async function(req, res){
    if(req.query.game === undefined || isNaN(req.query.game)){   
        return res.send(500)
    }
    let id = 0
    const user = validation(req)
    id = user.id || 0
    const [ost] = await pool.execute(`
    SELECT ost.*,
    (select count(*) from like_ost WHERE ost_id = ost.id) likes,
    like_ost.account_id liked
    FROM ost
    LEFT JOIN like_ost ON ost.id = like_ost.ost_id
    AND like_ost.account_id = ?
    WHERE ost.media_id = ?
    ORDER BY liked DESC, likes DESC, id`
    ,[id, req.query.game])

    const [skins] = await pool.execute(`
    SELECT s.id FROM media m INNER JOIN skins_media lnk ON lnk.media_id = m.id INNER JOIN skins s ON s.id = lnk.skin_id WHERE m.id = ${req.query.game} ORDER BY s.id DESC
    `)

    res.send({
        ...ost,
        ...skins
    })
}

module.exports = getGameOst