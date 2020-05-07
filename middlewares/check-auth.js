const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const verify = jwt.verify(token, 'somesupersecretsecret')
    res.locals.userVariable = verify.userId
    // console.log(userVariable)
    next()
  } catch (error) {
    res.status(401).json({ message: 'Auth failed!' })
  }
}
