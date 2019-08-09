const pool = require('../database/db')
require('../services/validation')();
require('../services/compress')();
const newPost = async function(req, res){
    const user = validation(req)
    if(!user){ return false }

    if(req.body.content.length <= 2){
        res.status(400).send('err-empty-message')
        return false;
    }

    const [post] = await pool.execute(`
    INSERT INTO posts (owner, content) VALUES (?, ?)`,
    [user.id, req.body.content]);

    let file = (req.files && req.files.uploadImage) ? req.files.uploadImage : false
    if(file){
        await pool.execute(`
        INSERT INTO posts_picture (post_id, path) VALUES (? , ?)`,
        [ post.insertId, '' + post.insertId + '.jpg']);

        let path = `/var/www/assets/posts/${post.insertId}.jpg`
        file.mv(path , function(err) {
        });

        compress(file, path)
    }
    
    res.status(200).send('success')
}

module.exports = newPost