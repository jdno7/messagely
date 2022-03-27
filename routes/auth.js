const express = require('express')
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../config')
const router = new express.Router()

const User = require('../models/user')

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/login', async (req,res,next) => {
    try {
        if (User.authenticate(req.body.username, req.body.password)){
            User.updateLoginTimestamp(req.body.username)
            const token = jwt.sign({username: req.body.username}, SECRET_KEY)
            return res.json({token})
        }
    } catch (e) {
        next (e)
    }
})



/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post('/register', async (req, res, next) => {
    const {username, password, first_name, last_name, phone} = req.body
    try {
        User.register({username, password, first_name, last_name, phone})
        User.updateLoginTimestamp(username)
        const token = jwt.sign({username: req.body.username}, SECRET_KEY)
        return res.json({token})
    } catch (e) {

    }
})

module.exports = router