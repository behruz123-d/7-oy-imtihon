const Cart = require('../model/cart.model');
const Product = require('../model/products.model');
const Order = require('../model/order.model');

const addOrder = async (req, res) => {
  const { address, phone } = req.body;

  if (!address || !phone) {
    return res.status(400).json({ message: 'address, phone are required' });
  }

  let cart = await Cart.findOne({ user: req.user.id }).populate(
    'items.product',
  );

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Savat bo'sh" });
  }

  for (const item of cart.items) {
    if (!item.product) {
      return res.status(404).json({ message: 'Mahsulot topilmadi' });
    }
    if (item.product.inStock < item.quantity) {
      return res.status(400).json({
        message: 'Faqat ' + item.product.inStock + ' ta mahsulot bor',
      });
    }
  }

  let items = cart.items.map((item) => ({
    product: item.product._id,
    title: item.product.title,
    price: item.product.price,
    image: item.product.image,
    quantity: item.quantity,
  }));

  let totalPrice = items.reduce((a, b) => a + b.quantity * b.price, 0);

  await Order.create({ user: req.user.id, items, address, phone, totalPrice });

  for (const item of cart.items) {
    await Product.updateOne(
      { _id: item.product._id },
      { $inc: { inStock: -item.quantity } },
    );
  }

  cart.items = [];
  await cart.save();
  res.status(201).json({ message: 'Mahsulotga buyurtma berildi' });
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({
    createdAt: -1,
  });

  res.json(orders);
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'username email')
    .sort({ createdAt: -1 });

  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowedStatuses = [
    'pending',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled',
  ];

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Status noto'g'ri" });
  }

  const updated = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  );

  if (!updated) {
    return res.status(404).json({ message: 'Buyurtma topilmadi' });
  }

  res.json({ message: 'Buyurtma holati yangilandi', order: updated });
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;

  const deleted = await Order.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(404).json({ message: 'Buyurtma topilmadi' });
  }

  res.json({ message: "Buyurtma o'chirildi" });
};

module.exports = {
  addOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};
