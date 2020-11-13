const jwt = require('jsonwebtoken')
const ejwt = require('express-jwt')

exports.generateToken = (name, email, password) => {
  return jwt.sign(
    {
      name,
      email,
      password,
    },
    process.env.SECRET_KEY,
    { expiresIn: '35m', issuer: '@itsmdsameerkhan' }
  )
}

exports.decodeToken = (token, secret) => {
  let response
  if (token) {
    jwt.verify(token, secret, function (err, decoded) {
      if (err)
        return (response = {
          error: 'Link Expired. Register Again!',
          success: false,
        })
      return (response = { name, email, password } = jwt.decode(token))
    })
  } else {
    response = { error: 'No token found', success: false }
  }
  return response
}

exports.authenticationToken = (payload, secret, rememberMe) => {
  let opt = { issuer: '@itsmdsameerkhan' }
  if (!rememberMe) {
    opt = { ...opt, expiresIn: '2h' }
  }
  return jwt.sign({ ...payload }, secret, opt)
}

exports.decodeIdFromToken = (token, secret) => {
  return jwt.verify(token, secret, function (err, decoded) {
    if (err) return false
    return true
  })
}

exports.verifyStoredToken = ejwt({
  secret: process.env.ACCOUNT_LOGIN_SECRET,
  algorithms: ['sha1', 'RS256', 'HS256'],
})

exports.signAToken = (data, secret) => {
  return jwt.sign({ ...data }, secret, { expiresIn: '7d' })
}
