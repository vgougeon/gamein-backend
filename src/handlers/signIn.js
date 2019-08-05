const pool = require('../database/db')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const signIn = async function(req, res){
  console.log(JSON.stringify(req.headers))
  const [{0: user}] = await pool.execute(`
    SELECT password, id
    FROM accounts 
    WHERE username = '${req.body.params.username}'
  `)
  const match = await bcrypt.compare(req.body.params.password, user.password)
  if(match){
    const token = jwt.sign({id: user.id}, 'temp_key', {
      algorithm: 'HS256',
      expiresIn: '1d'
    })
    res.send(token)
  }
  else {
    res.send(false)
  }
}

module.exports = signIn