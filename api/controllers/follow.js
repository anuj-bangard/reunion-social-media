const express = require('express')
const router = express.Router()
const userAuth = require('../../middleware/userAuth')
const { pool } = require('../../config/Db')
const { ErrorHandler } = require('../../services/handleError')

router.post('/follow/:id', userAuth, async (req, res, next) => {
    try {

        if (req.user.userId == req.params.id) {
            throw new ErrorHandler(405, {
                "errors": [{
                    "msg": "Error",
                }]
            })
        }

        let result = (await pool.query(`
        Select user_id from users
        where user_id = $1
        `, [req.params.id])).rows[0]
        if (!result) {
            throw new ErrorHandler(404, {
                "errors": [{
                    "msg": "User Not Found",
                }]
            })
        }
        result = (await pool.query(`
        Select * from follow_list
        where user_id = $1 and following_user_id = $2
        `, [req.user.userId, req.params.id])).rowCount
        if (result === 1) {
            throw new ErrorHandler(405, {
                "error": [{
                    "msg": "Already following"
                }]
            })
        }
        result = await pool.query(`INSERT INTO 
        FOLLOW_LIST(user_id,following_user_id) 
        VALUES($1,$2)
        `, [req.user.userId, req.params.id])

        if (result.rowCount === 1) {
            res.json({
                "success": [{
                    "msg": "Successfully Followed"
                }]
            })
        } else {
            throw new ErrorHandler()
        }

    } catch (error) {
        next(error)
    }
})

router.post('/unfollow/:id', userAuth, async (req, res, next) => {
    try {

        const unFollowingUser = (await pool.query(`
        Select user_id from users
        where user_id = $1
        `, [req.params.id])).rows[0]
        if (!unFollowingUser) {
            throw new ErrorHandler(404, {
                "errors": [{
                    "msg": "User Not Found",
                }]
            })
        }
        const result = await pool.query(`DELETE FROM 
        FOLLOW_LIST
        WHERE user_id=$1 AND following_user_id=$2`, [req.user.userId, req.params.id])

        if (result.rowCount === 1) {
            res.json({
                "success": [{
                    "msg": "Successfully Unfollowed"
                }]
            })
        } else {
            throw new ErrorHandler(405, {
                "error": [{
                    "msg": "Already Unfollowed"
                }]
            })
        }

    } catch (error) {
        next(error)
    }
})


module.exports = router;