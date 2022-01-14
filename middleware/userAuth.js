const jwt = require("jsonwebtoken");
const { ErrorHandler } = require('../services/handleError')

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            throw new ErrorHandler(403, {
                "errors": [{
                    "msg": "Access Denied"
                }]
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        throw new ErrorHandler(400, {
            "errors": [{
                "msg": "Invalid Token"
            }]
        })
    }
};