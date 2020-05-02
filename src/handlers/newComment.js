const pool = require('../database/db')
const socketServer = require('../classes/socketServer')
const exp = require('../config/experience.json')
require('../services/validation')();
require('../services/compress')();
const newComment = async function(req, res){
    const user = validation(req)
    if(!user){ return false }

    if(req.body.content.length <= 2){
        res.status(400).send('err-empty-message')
        return false;
    }

    const [comment] = await pool.execute(`
    INSERT INTO comments (owner, post_id, content) VALUES (?, ?, ?)`,
    [user.id, req.body.post_id, req.body.content]);

    const [data] = await pool.execute(`
    SELECT u.display_name, u.username, u.avatar, c.content 
    FROM comments c 
    INNER JOIN accounts u ON c.owner = u.id 
    WHERE c.id = ?`,
    [ comment.insertId ])

    socketServer.getClients(user.id)
    .forEach((socketClient) => {
        socketClient.addXp(exp["new-comment"].xp, "new-comment")
    })

    res.status(200).send(data)
}

module.exports = newComment