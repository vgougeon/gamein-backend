const pool = require('../database/db')
const getComments = async function(req, res){
  if(isNaN(req.query.post)){
    return 500
  }
  const [comments] = await pool.execute(`
    SELECT u.display_name, u.username, u.avatar, c.content 
    FROM comments c 
    INNER JOIN accounts u ON c.owner = u.id 
    WHERE post_id = ${req.query.post}
    ORDER BY on_date
  `)
  res.send(comments)
}

module.exports = getComments