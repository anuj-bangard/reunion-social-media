const express = require('express')
const router = express.Router()
const userAuth = require('../../middleware/userAuth')
const { pool } = require('../../config/Db')
const { ErrorHandler } = require('../../services/handleError')

router.post('/like/:id', userAuth, async (req, res, next) => {
    try {
        let result = (await pool.query(`
        Select post_id from posts
        where post_id = $1
        `, [req.params.id])).rows[0]
        if (!result) {
            throw new ErrorHandler(404, {
                "errors": [{
                    "msg": "Post Not Found",
                }]
            })
        }
        result = (await pool.query(`
        Select * from likes
        where post_id = $1 and user_id = $2
        `, [req.params.id, req.user.userId])).rowCount
        if (result === 1) {
            throw new ErrorHandler(405, {
                "error": [{
                    "msg": "Already Liked"
                }]
            })
        }
        result = await pool.query(`INSERT INTO 
        Likes(post_id,user_id) 
        VALUES($1,$2)
        `, [req.params.id, req.user.userId])

        if (result.rowCount === 1) {
            res.json({
                "success": [{
                    "msg": "Successfully Liked"
                }]
            })
        } else {
            throw new ErrorHandler()
        }

    } catch (error) {
        next(error)
    }
})

router.post('/unlike/:id', userAuth, async (req, res, next) => {
    try {

        const unFollowingUser = (await pool.query(`
        Select post_id from posts
        where post_id = $1
        `, [req.params.id])).rows[0]
        if (!unFollowingUser) {
            throw new ErrorHandler(404, {
                "errors": [{
                    "msg": "Post Not Found",
                }]
            })
        }
        const result = await pool.query(`DELETE FROM 
        LIKES
        WHERE post_id=$1 AND user_id=$2`,
            [req.params.id, req.user.userId])

        if (result.rowCount === 1) {
            res.json({
                "success": [{
                    "msg": "Successfully Unliked"
                }]
            })
        } else {
            throw new ErrorHandler(405, {
                "error": [{
                    "msg": "Already Unliked"
                }]
            })
        }

    } catch (error) {
        next(error)
    }
})


module.exports = router;