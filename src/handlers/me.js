const pool = require('../database/db');
const jwt = require('jsonwebtoken');
const log = require('../services/logging');
const me = async function(req, res){
  if(req.get('authorization') === undefined){
    res.send('false')
    return false
  }
  let u
  try {
    u = jwt.verify(req.get('authorization'), 'temp_key');
  } catch(err) {
    res.send("Expired...")
    return false
  }
  const [{0: user}] = await pool.execute(`
    SELECT accounts.*, grades.name gradeName,
    (SELECT COUNT(id) FROM posts WHERE owner = ${u.id}) as posts,
    (SELECT COUNT(id) FROM follows WHERE followed_id = ${u.id}) as followers
    FROM accounts 
    INNER JOIN grades ON accounts.grade = grades.id 
    WHERE accounts.id = ${u.id}
  `)
  delete user.password
  user.level = user.experience / 10 - user.experience % 10 / 10
  log.info("me.js", "Sent account information", user.username)
  res.send(user)
}

module.exports = me