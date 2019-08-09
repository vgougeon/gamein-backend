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

    const [{0: newPost}] = await pool.execute(`
    SELECT 
    posts.*,
    DATE_FORMAT(posts.date, "%M %e - %H:%i") as dateformat,
    accounts.username, accounts.display_name, accounts.avatar, 
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
    ORDER BY posts.date DESC
    LIMIT 5
    WHERE posts.id = ?`,
    [post.insertId])

    res.status(200).send(newPost)
}

module.exports = newPost