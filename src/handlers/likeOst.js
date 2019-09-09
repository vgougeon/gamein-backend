const pool = require('../database/db')
require('../services/validation')();

const likeOst = async function(req, res){
  const user = validation(req)
  if(!user){ return res.status(500).send('not-logged-in')}

  if(!req.body.id){ return res.status(500).send('no-ost-specified')}
  
  //Check if already liked
  const [{0: like}] = await pool.execute(`
    SELECT COUNT(id) n FROM like_ost
    WHERE account_id = ? AND ost_id = ?`,
    [user.id, req.body.id])

  if(like.n === 0){
    await pool.execute(`
      INSERT INTO like_ost (account_id, ost_id)
      VALUES (?, ?)`,
      [user.id, req.body.id])
    return res.status(200).send('1')
  } else {
    await pool.execute(`
      DELETE FROM like_ost 
      WHERE account_id = ? AND ost_id = ?`,
      [user.id, req.body.id])
    return res.status(200).send('-1')
  }

}
module.exports = likeOst