const pool = require('../database/db')
require('../services/validation')();

const likePost = async function(req, res){
  const user = validation(req)
  if(!user){ return res.status(500).send('not-logged-in')}

  if(!req.body.id){ return res.status(500).send('no-post-specified')}
  
  //Check if already liked
  const [{0: like}] = await pool.execute(`
    SELECT COUNT(id) n FROM like_post
    WHERE account_id = ? AND post_id = ?`,
    [user.id, req.body.id])

  if(like.n === 0){
    await pool.execute(`
      INSERT INTO like_post (account_id, post_id)
      VALUES (?, ?)`,
      [user.id, req.body.id])
    return res.status(200).send('1')
  } else {
    await pool.execute(`
      DELETE FROM like_post 
      WHERE account_id = ? AND post_id = ?`,
      [user.id, req.body.id])
    return res.status(200).send('-1')
  }

}
module.exports = likePost