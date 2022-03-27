const express = require('express')
const router = new express.Router()
const {authenticateJWT, ensureLoggedIn,ensureCorrectUser} = require('../middleware/auth') 
const User = require('../models/user')

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get('/', async (req, res, next) => {
    const users = await User.all()
    res.json({users})
})


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get('/:username', ensureCorrectUser, async (req, res, next) => {
    const username = req.params.username
    const user = await User.get(username)
    res.json({user})
})

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/to', ensureCorrectUser, async (req, res, next) => {
    const messages = await User.messagesTo(req.params.username)
    console.log(messages)
    res.json({messages})
  
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/from', ensureCorrectUser, async (req, res, next) => {
    const messages = await User.messagesFrom(req.params.username)
    console.log(messages)
    res.json({messages})
  
})
 module.exports = router