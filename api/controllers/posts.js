const express = require('express')
const router = express.Router()
const userAuth = require('../../middleware/userAuth')
const { pool } = require('../../config/Db')
const { ErrorHandler } = require('../../services/handleError')

router.get('/posts/:id', userAuth, async (req, res, next) => {
    try {
        let result = {
            id: req.params.id,
            likes: 0,
            comments: 0
        }
        result.likes = (await pool.query(`
        SELECT COUNT(*) FROM LIKES
        WHERE POST_ID=$1
        `, [req.params.id]))?.rows[0].count

        result.comments = (await pool.query(`
        SELECT COUNT(*) FROM COMMENTS
        WHERE POST_ID=$1
        `, [req.params.id]))?.rows[0].count

        console.log(result)
        res.json(result)

    } catch (error) {
        next(error)
    }
})

router.get('/all_posts', userAuth, async (req, res, next) => {
    try {
        const posts = await pool.query("SELECT * FROM posts order by created_at desc")
        const no_of_posts = posts.rowCount;
        let result = []
        for (var i = 0; i < no_of_posts; i++) {
            var post = posts.rows[i];
            let comments = [];
            const cmnt = await pool.query("SELECT (comment) FROM comments WHERE post_id=$1", [post.post_id]);
            const comment_count = cmnt.rowCount
            for (let j = 0; j < comment_count; j++) {
                comments.push(cmnt.rows[j].comment);
            }
            const no_of_likes = (await pool.query("SELECT COUNT(*) FROM likes WHERE post_id = $1", [post.post_id])).rows[0].count;
            const cur_post = {
                post_id: post.post_id,
                title: post.title,
                description: post.description,
                created_at: post.created_at,
                comments: comments,
                likes: no_of_likes
            };
            result.push(cur_post);
        }
        res.json(result)

    } catch (error) {
        next(error)
    }
})

router.post('/posts/', userAuth, async (req, res, next) => {
    try {
        const { title, description } = req.body
        const result = (await pool.query(`
        INSERT INTO 
        POSTS(TITLE,DESCRIPTION,CREATED_AT,USER_ID) 
        VALUES($1,$2,$3,$4)
        RETURNING POST_ID,TITLE,DESCRIPTION,CREATED_AT
        `, [title, description, new Date(), req.user.userId]))?.rows[0]
        if (result.length == 0) {
            throw new ErrorHandler()
        }
        res.json(result)

    } catch (error) {
        next(error)
    }
})

router.delete('/posts/:id', userAuth, async (req, res, next) => {
    try {
        const result = (await pool.query(`
        DELETE FROM POSTS 
        WHERE POST_ID=$1
        `, [req.params.id])).rowCount
        console.log(result)
        if (result === 1) {
            res.json({
                "success": [{
                    "msg": "Successfully Deleted"
                }]
            })
        } else {
            throw new ErrorHandler(404, {
                "errors": [{
                    "msg": "Post Not Found",
                }]
            })
        }

    } catch (error) {
        next(error)
    }
})

module.exports = router;