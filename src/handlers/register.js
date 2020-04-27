const pool = require('../database/db')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const log = require('../services/logging')
const register = async function(req, res){
  log.info("register.js", "Register attempt", req.body.params.username)
  if(req.body.params.username.length < 3) return res.status(403).send('username-too-small')
  if(req.body.params.username.length > 15) return res.status(403).send('username-too-long')
  if(req.body.params.password.length < 4) return res.status(403).send('password-too-small')
  const [{0: user}] = await pool.execute(`
    SELECT username
    FROM accounts 
    WHERE username = '${req.body.params.username}'
  `)
  return res.status(200).send(user)
  // const match = await bcrypt.compare(req.body.params.password, user.password)
  // if(match){
  //   const token = jwt.sign({id: user.id, name: user.username}, 'temp_key', {
  //     algorithm: 'HS256',
  //     expiresIn: '1d'
  //   })
  //   res.send(token)
  //   log.info("SignIn.js", "Connected", req.body.params.username)
  // }
}

module.exports = register