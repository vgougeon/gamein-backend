const pool = require('../database/db')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const log = require('../services/logging')
const signIn = async function(req, res){
  const [{0: user}] = await pool.execute(`
    SELECT password, id, username
    FROM accounts 
    WHERE username = '${req.body.params.username}'
  `)
  if(!user) return res.status(201).send("wrong-password-or-username")
  const match = await bcrypt.compare(req.body.params.password, user.password)
  if(match){
    const token = jwt.sign({id: user.id, name: user.username}, 'temp_key', {
      algorithm: 'HS256',
      expiresIn: '1d'
    })
    res.status(200).send(token)
    log.info("SignIn.js", "Connected", req.body.params.username)
  }
  else {
    return res.status(201).send("wrong-password-or-username")
  }
}

module.exports = signIn