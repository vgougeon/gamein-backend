const pool = require('../database/db')
const jwt = require('jsonwebtoken');
const me = async function(req, res){
  // const hash = await bcrypt.hash(req.body.params.password, 10)
  const token = jwt.sign({id: 6}, 'gamein', {
    algorithm: 'HS256',
    expiresIn: '1d'
  })
  //J'ai mon token, je dois verifier
  let decoded;
  try {
    decoded = jwt.verify(token, 'gamein');
  } catch(err) {
    res.send("Expired...")
    return false
  }
  res.send(token)
  return true
  if(!req.session.uid){
    res.send(false)
    return false
  }
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