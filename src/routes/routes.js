module.exports = function(pool) {
  const express = require('express')
  const router = express.Router()

  router.get('/me', async (req, res) => {
    //créer une classe user et un fichier des fichiers séparés pour les routes
    req.session.uid = '6'
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
  })

  return router;
}