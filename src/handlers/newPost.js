const pool = require('../database/db')
const escape = require('escape-html');
const log = require('../services/logging')
const socketServer = require('../classes/socketServer')
const exp = require('../config/experience.json')
require('../services/validation')();
require('../services/compress')();
const newPost = async function(req, res){
    const user = validation(req)
    if(!user){ return false }
    log.info('newPost.js', 'New post', user.id)
    if(req.body.content.length <= 2){
        res.status(400).send('err-empty-message')
        log.info('newPost.js', 'Post is empty', user.id)
        return false;
    }
    
    req.body.content = escape(req.body.content)

    const [post] = await pool.execute(`
    INSERT INTO posts (owner, content) VALUES (?, ?)`,
    [user.id, req.body.content]);

    let file = (req.files && req.files.uploadImage) ? req.files.uploadImage : false
    if(file){
        log.info('newPost.js', 'Post with image', user.id)
        await pool.execute(`
        INSERT INTO posts_picture (post_id, path) VALUES (? , ?)`,
        [ post.insertId, '' + post.insertId + '.jpg']);

        let path = `/var/www/assets/posts/${post.insertId}.jpg`
        await file.mv(path , function(err) {
        });
        
        await compress(file, path)
    }
    else {
        log.info('newPost.js', 'No image', user.id)
    }

    const [{0: newPost}] = await pool.execute(`
    SELECT 
    posts.*,
    accounts.username, accounts.display_name, accounts.avatar, accounts.experience, accounts.skin,
    grades.name, 
    like_post.account_id,
    (select count(*) from like_post WHERE post_id = posts.id) likes,
    (select count(*) from comments WHERE post_id = posts.id) comments,
    p.path
    FROM posts
    LEFT JOIN like_post ON posts.id = like_post.post_id
    AND like_post.account_id = " . $id . "
    LEFT JOIN accounts ON accounts.id = posts.owner
    LEFT JOIN grades ON grades.id = accounts.grade
    LEFT JOIN posts_picture p ON p.post_id = posts.id
    WHERE posts.id = ?`,
    [post.insertId])

    socketServer.getClients(user.id)
    .forEach((socketClient) => {
        socketClient.addXp(exp["new-post"].xp, "new-post")
    })

    return res.status(200).send(newPost)
}

module.exports = newPost