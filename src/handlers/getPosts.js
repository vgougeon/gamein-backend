const pool = require('../database/db')
require('../services/validation')();
const getPosts = async function(req, res){
  let id = 0
  const user = validation(req)
  if(user){ id = user.id }
  const [posts] = await pool.execute(`
    SELECT 
    posts.*,
    accounts.username, accounts.display_name, accounts.avatar, accounts.experience, accounts.skin,
    grades.name, 
    like_post.account_id,
    (select count(*) from like_post WHERE post_id = posts.id) likes,
    (select count(*) from comments WHERE post_id = posts.id) comments,
    p.path
    FROM posts
    LEFT JOIN like_post ON posts.id = like_post.post_id
    AND like_post.account_id = ?
    LEFT JOIN accounts ON accounts.id = posts.owner
    LEFT JOIN grades ON grades.id = accounts.grade
    LEFT JOIN posts_picture p ON p.post_id = posts.id
    ORDER BY posts.date DESC
    LIMIT 10`,
    [id]
    )
  res.status(200).send(posts)
}

module.exports = getPosts