const { Router } = require("express")
const {
  addOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controller/order.controller")
const { protect, adminOnly } = require("../middleware/auth")

const router = Router()

router.post("/add", protect, addOrder)
router.get("/my_orders", protect, getMyOrders)
router.get("/get_all", protect, adminOnly, getAllOrders)
router.put("/update/:id", protect, adminOnly, updateOrderStatus)
router.delete("/delete/:id", protect, adminOnly, deleteOrder)

module.exports = router
