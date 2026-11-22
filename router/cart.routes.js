const { Router } = require("express")
const { protect } = require("../middleware/auth")
const { sendCart, addCart } = require("../controller/cart.controller")

const router = Router()

router.get("/send_cart", protect, sendCart)
router.post("/add", protect, addCart)

module.exports = router
