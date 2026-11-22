// Category qismi oldingi darsda yozilgan, bu videolarda to'liq ko'rsatilmagan.
// Products ishlashi uchun oddiy versiya:
const categoryModel = require('../model/category.model');

const getAllCategory = async (req, res) => {
  const categories = await categoryModel.find().sort({ createdAt: -1 });
  res.json(categories);
};

const addCategory = async (req, res) => {
  const { title } = req.body;
  await categoryModel.create({ title });
  res.status(201).json({ message: "Category qo'shildi" });
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const updated = await categoryModel.findByIdAndUpdate(id, { title }, { new: true });
  if (!updated) return res.status(404).json({ message: 'Category topilmadi' });
  res.json({ message: 'Category yangilandi' });
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const deleted = await categoryModel.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Category topilmadi' });
  res.json({ message: "Category o'chirildi" });
};

module.exports = { getAllCategory, addCategory, updateCategory, deleteCategory };
