const pool = require('../database/db')
const log = require('../services/logging');
// const io = require('../socket/socket');
const socketServer = require('../classes/socketServer')
require('../services/validation')();

const addListenOst = async function(req, res){
  const user = validation(req)
  if(user) log.info("addListenOst.js", req.body.name , user.name)
  else log.info("addListenOst.js", req.body.name, "")
  
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

  socketServer.getClients(user.id)
  .forEach((socketClient) => {
    socketClient.addXp(1, "ost-play")
  })
  return res.status(200).send('1')

}
module.exports = addListenOst