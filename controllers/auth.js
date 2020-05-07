const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

exports.signup = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.')
        error.statusCode = 422
        error.data = errors.array()
        console.log(error)
        throw error
    }
    const name = req.body.name.toLowerCase()
    const email = req.body.email.toLowerCase()
    const password = req.body.password

    async function runSignup() {
        try {
            const hashedPw = await bcrypt.hash(password, 12);
            const user = await User.create({ name: name, email: email, password: hashedPw })
            res.status(200).json({ message: "Successfully Signed" })
        } catch (error) {
            throw error
        }
    }
    runSignup();

}

exports.login = (req, res, next) => {
    const email = req.body.email.toLowerCase()
    const password = req.body.password
    let loadedUser
    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                const error = new Error('A user with this email could not be found.')
                error.statusCode = 401
                throw error
            }
            loadedUser = user
            return bcrypt.compare(password, user.password)
        })
        .then((isEqual) => {
            if (!isEqual) {
                const error = new Error('Wrong password!')
                error.statusCode = 401
                throw error
            }
            const userId = loadedUser.email
            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString(),
                },
                'somesupersecretsecret',
                { expiresIn: '1h' }
            )
            res.status(200).json({ token: token, userId: loadedUser._id.toString() })
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}