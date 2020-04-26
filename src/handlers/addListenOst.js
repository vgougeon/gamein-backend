const pool = require('../database/db')

const addListenOst = async function(req, res){

  if(!req.body.id){ return res.status(500).send('no-ost-specified')}
  await pool.execute(`
    UPDATE ost
    SET plays = plays + 1
    WHERE id = ?`
    [req.body.id])
  return res.status(200).send('1')

}
module.exports = addListenOst