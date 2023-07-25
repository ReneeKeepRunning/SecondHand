const express = require('express')
const router = express.Router()
const Client = require('../types/client')
const clients= require('../controllers/clients')
const catchAsync = require('../helper/catchAsync')
const { application } = require('express')
const passport = require('passport')
const { loggedCheck } = require('../middleware')

router.route('/register')
    .get(clients.registerForm)
    .post(catchAsync(clients.registerFormPost))

router.route('/login')
    .get(clients.loginForm)
    .post(passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), clients.loginFormPost)

router.get('/logout', loggedCheck, clients.logout)

module.exports = router