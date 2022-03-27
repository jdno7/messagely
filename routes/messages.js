const express = require('express')
const ExpressError = require('../expressError')
const router = new express.Router()
const {authenticateJWT, ensureLoggedIn,ensureCorrectUser} = require('../middleware/auth') 
const Message = require('../models/message')

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get('/:id', async (req, res, next) => {
    try {
        const message = await Message.get(req.params.id)
        if (req.user.username != message.from_user.username || req.user.username != message.to_user.username) {
            throw new ExpressError('Not Authorized to view message')
        }
        // console.log(message.from_user.username, message.to_user.username)
        res.json({message})
    } catch (e) {
        next(e)
    }
   
})


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const {from_username, to_username, body} = req.body
        const message = await Message.create({from_username, to_username, body})
        res.json({message})
    } catch (e) {
        next(e)
    }
    
})


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post('/:id/read', async (req, res, next) => {
    const m = Message.get(req.params.id)
    try{
        if (m.to_username != req.user.username){
            throw new ExpressError('NoT Authorized to Mark as Read!!', 400)
        }
        const readMsg = await Message.markRead(req.params.id)
        res.json(readMsg)
    
    } catch (e) {
        next (e)
    }
})

module.exports = router