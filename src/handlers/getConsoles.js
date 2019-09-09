const pool = require('../database/db')
const getConsoles = async function(req, res){
  
  const [consoles] = await pool.execute(`
  SELECT id, name, background from consoles
  `)

  res.send(consoles)
  
}

module.exports = getConsoles