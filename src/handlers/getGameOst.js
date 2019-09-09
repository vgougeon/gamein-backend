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
    ORDER BY liked DESC, likes DESC`
    ,[id, req.query.game])

    res.send(ost)
}

module.exports = getGameOst