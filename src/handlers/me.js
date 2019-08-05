const pool = require('../database/db')
const me = async function(req, res){
  console.log(req.get('authorization'))
  const [{0: user}] = await pool.execute(`
    SELECT accounts.*, grades.name gradeName,
    (SELECT COUNT(id) FROM posts WHERE owner = 6) as posts,
    (SELECT COUNT(id) FROM follows WHERE followed_id = 6) as followers
    FROM accounts 
    INNER JOIN grades ON accounts.grade = grades.id 
    WHERE accounts.id = 6
  `)
  delete user.password
  user.level = user.experience / 10 - user.experience % 10 / 10
  res.send(user)
}

module.exports = me