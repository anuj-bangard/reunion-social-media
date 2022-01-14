const express = require('express')
const router = express.Router()
const userAuth = require('../../middleware/userAuth')
const { pool } = require('../../config/Db')
const { ErrorHandler } = require('../../services/handleError')

router.post('/comment/:id', userAuth, async (req, res, next) => {
    try {
        const { comment } = req.body
        const result = (await pool.query(`
        INSERT INTO 
        COMMENTS(COMMENT,POST_ID,USER_ID) 
        VALUES($1,$2,$3)
        RETURNING COMMENT_ID
        `, [comment, req.params.id, req.user.userId]))?.rows[0]
        if (result.length == 0) {
            throw new ErrorHandler()
        }
        res.json(result)

    } catch (error) {
        next(error)
    }
})


module.exports = router;