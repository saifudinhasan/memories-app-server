import jwt, { decode } from 'jsonwebtoken'

const auth = async (req, res, next) => {
  try {

    // Token sent from frontend middleware interceptor
    const token = req.headers.authorization.split(" ")[1]

    // True ? emailAndPassword : googleOAuth
    const isCustomAuth = token.length < 500

    let decodedData

    if (token && isCustomAuth) {
      // emailAndPassword token ...
      decodedData = jwt.verify(token, 'the_secret_jwt_password')
      req.userId = decodedData?.id
    } else {
      // googleOAuth token ...
      decodedData = jwt.decode(token)
      req.userId = decodedData?.sub
    }

    next()

  } catch (error) { }
}

export default auth