const express = require('express')
const router = express.Router()
const userAuth = require('../../middleware/userAuth')
const { pool } = require('../../config/Db')

router.post('/user/', userAuth, async (req, res, next) => {
    try {
        let result = {
            name: req.user.name,
            following: 0,
            followers: 0
        }
        result.following = (await pool.query(`
        Select 
        COUNT(user_id)
        FROM FOLLOW_LIST
        WHERE user_id=$1
        `, [req.user.userId])).rows[0].count

        result.followers = (await pool.query(`
        Select 
        COUNT(following_user_id)
        FROM FOLLOW_LIST
        WHERE following_user_id=$1
        `, [req.user.userId]))?.rows[0]?.count
        //console.log(result)
        res.json(result)

    } catch (error) {
        next(error)
    }
})

module.exports = router;