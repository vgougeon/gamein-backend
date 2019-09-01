const pool = require('../database/db')
const getOst = async function(req, res){
    if(req.query.id === undefined || isNaN(req.query.id)){   
        return res.send(500)
    }
    const [{0: ost}] = await pool.execute(`
    SELECT ost.*, media.name as media_name FROM ost
    JOIN media ON media.id = ost.media_id
    WHERE ost.id= ?`
    ,[req.query.id])
    
    res.send(ost)
}

module.exports = getOst