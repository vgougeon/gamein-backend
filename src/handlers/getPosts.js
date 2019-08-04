const pool = require('../database/db')
const getPosts = async function(req, res){
  req.session.uid = '6'

  const [posts] = await pool.execute(`
    SELECT posts.*, accounts.username, accounts.display_name, accounts.avatar, grades.name, like_post.account_id,
    (select count(*) from like_post WHERE post_id = posts.id) likes,
    (select count(*) from comments WHERE post_id = posts.id) comments,
    p.path
    FROM posts
    LEFT JOIN like_post ON posts.id = like_post.post_id
    AND like_post.account_id = " . $id . "
    LEFT JOIN accounts ON accounts.id = posts.owner
    LEFT JOIN grades ON grades.id = accounts.grade
    LEFT JOIN posts_picture p ON p.post_id = posts.id
    ORDER BY posts.date DESC
    LIMIT 5
  `)
  res.send(posts)
}

module.exports = getPosts