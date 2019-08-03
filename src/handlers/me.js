const pool = require('../database/db')
const me = function(req, res){
  console.debug(pool)
  res.send("Gamein API")
}

module.exports = me