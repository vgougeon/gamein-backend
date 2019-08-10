const pool = require('../database/db')
const getGames = async function(req, res){
  const offset = req.query.offset || 0;

  const [games] = await pool.execute(`
  SELECT m.id, m.name, year(m.release_date) as release_year, s.skin as skin,
  IF( 
    c.id IS NULL, 
    json_array(),
    JSON_ARRAYAGG(JSON_OBJECT(
      "id", c.id,
      "name", c.name,
      "short", c.short,
      "color", c.color,
      "background", c.background
      ))
  ) as console
  FROM media m
  LEFT JOIN media_consoles mc ON mc.media_id = m.id
  LEFT JOIN consoles c ON mc.console_id = c.id
  LEFT JOIN (SELECT JSON_ARRAYAGG(skin_id) as skin, media_id FROM skins_media GROUP BY media_id) s ON s.media_id = m.id
  GROUP BY m.id
  LIMIT 8 OFFSET ?
  `,
  [offset])
  res.send(games)
}

module.exports = getGames