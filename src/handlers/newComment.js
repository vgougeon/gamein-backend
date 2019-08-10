const pool = require('../database/db')
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

    res.status(200).send("success")
}

module.exports = newComment