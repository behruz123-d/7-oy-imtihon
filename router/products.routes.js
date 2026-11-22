const { Router } = require("express")
const { addProduct, getAllProducts, updateProduct, deleteProduct } = require("../controller/products.controller")
const uploads = require("../middleware/upload")
const { protect, adminOnly } = require("../middleware/auth")

const router = Router()

router.get("/get_all", getAllProducts)
router.post("/add", protect, adminOnly, uploads.single("image"), addProduct)
router.put("/update/:id", protect, adminOnly, uploads.single("image"), updateProduct)
router.delete("/delete/:id", protect, adminOnly, deleteProduct)

module.exports = router
