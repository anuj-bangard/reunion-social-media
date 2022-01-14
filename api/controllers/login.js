const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const { ErrorHandler } = require('../../services/handleError')
const { pool } = require('../../config/Db')

router.post('/authenticate', [
    check("email", "Please provide a valid Mobile Number!")
        .isEmail(),
    check("password", "Enter password greater then 5 characters")
        .isLength(6)
], async (req, res, next) => {

    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({
            error: error.array()
        })
    }
    try {

        const {
            email,
            password: userPassword
        } = req.body

        const result = await pool.query(`
        SELECT * from users
        WHERE email=$1
        `, [email])
        //console.log('user found', result)
        if (!result.rows.length) {
            throw new ErrorHandler(404, {
                "errors": [{
                    "msg": "User Not Found",
                }]
            })
        }

        const { user_id: userId, name, password } = result.rows[0]

        if (userPassword != password) {
            throw new ErrorHandler(400, {
                "errors": [{
                    "msg": "Invalid Password",
                }]
            })
        }

        const token = jwt.sign({
            userId,
            email,
            name
        }, process.env.JWT_KEY)
        res.json({
            "token": token
        })
    } catch (error) {
        //console.log(error)
        next(error)
    }
})

module.exports = router;