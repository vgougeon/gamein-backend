const pool = require('../database/db')
const getOst = async function(req, res){
    if(req.query.id === undefined || isNaN(req.query.id)){   
        return res.send(500)
    }
    let id = 0
    const user = validation(req)
    id = user.id || 0
    const [{0: ost}] = await pool.execute(`
    SELECT ost.*, media.name as media_name,
    (select count(*) from like_ost WHERE ost_id = ost.id) likes
    FROM ost
    LEFT JOIN media ON media.id = ost.media_id
    LEFT JOIN like_ost ON ost.id = like_ost.ost_id
    AND like_ost.account_id = ?
    WHERE ost.id= ?`
    ,[id, req.query.id])
    
    res.send(ost)
}

module.exports = getOst