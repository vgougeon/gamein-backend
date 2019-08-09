const pool = require('../database/db')
const getGames = async function(req, res){
  const offset = req.query.offset || 0;

  const [games] = await pool.execute(`
  SELECT m.id, GROUP_CONCAT(c.name, ':', c.color) as consoles FROM media m
  JOIN media_consoles mc ON mc.media_id = m.id
  JOIN consoles c ON mc.console_id = c.id
  GROUP BY m.id
  LIMIT 8
  
  `)

  for(let game of games){
    game.consoles = game.consoles.split(',')
    for(let i = 0; i < game.consoles.length; i++){
      game.consoles[i] = game.consoles[i].split(':')
      game.consoles[i] = {
        name: game.consoles[i][0],
        color: game.consoles[i][1]
      }
    }
  }
  res.send(games)
}

module.exports = getGames