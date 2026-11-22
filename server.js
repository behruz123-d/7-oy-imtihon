const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
require("dotenv").config()
const authRouter = require("./router/auth.routes")
const categoryRouter = require("./router/category.routes")
const productRouter = require("./router/products.routes")
const cartRouter = require("./router/cart.routes")
const orderRouter = require("./router/order.routes")

const app = express()
app.use(cors())
app.use(express.json())
// rasmlar http://localhost:4001/uploads/... manzilida ochilishi uchun
app.use("/uploads", express.static("uploads"))
const PORT = process.env.PORT || 3000

// router
app.use("/api/auth", authRouter)
app.use("/api/category", categoryRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

connectDB()

app.listen(PORT, () => {
  console.log("Server is running at: " + PORT);
})
