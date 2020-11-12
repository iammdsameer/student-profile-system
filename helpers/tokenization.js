const jwt = require('jsonwebtoken')

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

exports.decodeToken = (token) => {
  let response
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
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

exports.authenticationToken = (payload, rememberMe) => {
  let opt = { issuer: '@itsmdsameerkhan' }
  if (!rememberMe) {
    opt = { ...opt, expiresIn: '2h' }
  }
  return jwt.sign({ ...payload }, process.env.ACCOUNT_LOGIN_SECRET, opt)
}
