const pool = require('../database/db')
const getGameOst = async function(req, res){
    if(req.query.game === undefined || isNaN(req.query.game)){   
        return res.send(500)
    }
    const [ost] = await pool.execute(`
    SELECT * FROM ost WHERE media_id = ?`
    ,[req.query.game])
    
    res.send(ost)
}

module.exports = getGameOst