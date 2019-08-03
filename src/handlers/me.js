const pool = require('../database/db')
const me = async function(req, res){
  req.session.uid = '7'
  const [{0: user}] = await pool.execute(`
    SELECT accounts.*, grades.name gradeName,
    (SELECT COUNT(id) FROM posts WHERE owner = ${req.session.uid}) as posts,
    (SELECT COUNT(id) FROM follows WHERE followed_id = ${req.session.uid}) as followers
    FROM accounts 
    INNER JOIN grades ON accounts.grade = grades.id 
    WHERE accounts.id = ${req.session.uid}
  `)
  delete user.password
  user.level = user.experience / 10 - user.experience % 10 / 10
  res.send(user)
}

module.exports = me