const pool = require('../database/db')
require('../services/validation')();
const getFriends = async function(req, res){
  const user = validation(req)
  if(!user){ return res.status(500).send('not-logged-in')}

  
  const [friends] = await pool.execute(`
  SELECT A.followed_id AS id, user.username, user.avatar, user.display_name FROM follows as A
  JOIN follows as B
  ON A.follower_id = B.followed_id
  AND A.followed_id = B.follower_id

  INNER JOIN accounts user
  ON user.id = A.followed_id

  WHERE A.follower_id = ?
  GROUP BY A.id
  `,[user.id])

  res.send(friends)
  
}

module.exports = getFriends