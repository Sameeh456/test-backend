const express = require('express')
const { check, validationResult } = require('express-validator')

const User = require('../models/user')

const router = express.Router()

const authController = require('../controllers/auth')

router.put('/', [
    check('email', 'Your email is not Valid').not().isEmpty().isEmail(),
    check('email').custom(async function (value) {
        var emailCheck = await User.find({ email: value })
        return emailCheck.length == 0;
    })
        .withMessage('Email already exits'),
    check('password', 'Password is required').not().isEmpty(),
    check('name').not().isEmpty().withMessage('Name is required'),
],
    authController.signup)

router.post('/', authController.login)

module.exports = router
