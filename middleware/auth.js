const jwt = require("jsonwebtoken")

const protect = async (req, res, next) => {
  const authorization = req.headers.authorization

  const token = authorization?.split(" ")[1]
  if (authorization?.split(" ")[0] !== "Bearer" || !token) {
    return res.status(400).json({
      message: "Bearer yoki token topilmadi"
    })
  }

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decode
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }

  next()
}

const adminOnly = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Siz admin emassiz"
    })
  }
  next()
}

module.exports = {
  protect,
  adminOnly
}
