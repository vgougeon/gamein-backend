const pool = require('../database/db')
const log = require('../services/logging');
require('../services/validation')();

const addListenOst = async function(req, res){
  const user = validation(req)
  if(user) log.info("addListenOst.js", "New listen !" , user.name)
  else log.info("addListenOst.js", "New listen !", "")
  
  if(!req.body.id){ return res.status(500).send('no-ost-specified')}
  await pool.execute(`
    UPDATE ost
    SET plays = plays + 1
    WHERE id = ?`,
    [req.body.id])
  
  if(user){ 
    await pool.execute(`
    UPDATE accounts
    SET listens = listens + 1
    WHERE id = ?`,
    [user.id])
  }
  return res.status(200).send('1')

}
module.exports = addListenOst