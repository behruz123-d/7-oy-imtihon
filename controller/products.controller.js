const productsModel = require('../model/products.model');
const categoryModel = require('../model/category.model');
const fs = require('fs');
const path = require('path');

const deleteImage = (image) => {
  return fs.unlink(
    path.join(
      __dirname,
      '../uploads',
      image.split('/')[image.split('/').length - 1],
    ),
    () => {},
  );
};

const getAllProducts = async (req, res) => {
  const { title } = req.query;

  const products = await productsModel
    .find({ title: { $regex: title ? title : '', $options: 'i' } })
    .populate('category', 'title')
    .sort({ createdAt: -1 });

  res.json(products);
};

const addProduct = async (req, res) => {
  const { title, description, price, inStock, category } = req.body;
  const image = req.file
    ? `http://localhost:4001/uploads/${req.file.filename}`
    : '';

  try {
    const foundedCategory = await categoryModel.findById(category);
    if (!foundedCategory) {
      return res.status(404).json({
        message: 'Category topilmadi',
      });
    }

    await productsModel.create({
      title,
      description,
      price,
      inStock,
      category,
      image,
    });

    res.status(201).json({
      message: "Mahsulot qo'shildi",
    });
  } finally {
    if (res.statusCode !== 201) deleteImage(image);
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, inStock, category } = req.body;
  const image = req.file
    ? `http://localhost:4001/uploads/${req.file.filename}`
    : '';
  let saved = false;

  const foundedProduct = await productsModel.findById(id);

  if (!foundedProduct) {
    return res.status(404).json({
      message: 'Mahsulot topilmadi',
    });
  }

  const oldImage = foundedProduct.image;

  if (title !== undefined) foundedProduct.title = title;
  if (description !== undefined) foundedProduct.description = description;
  if (price !== undefined) foundedProduct.price = price;
  if (inStock !== undefined) foundedProduct.inStock = inStock;
  if (category !== undefined) foundedProduct.category = category;

  // Videoda: if (image) ((foundedProduct.image = image), await foundedProduct.save());
  // U holda rasmsiz yangilanish saqlanmay qolardi, shuning uchun save() alohida qatorda.
  if (image) foundedProduct.image = image;
  await foundedProduct.save();
  saved = true;
  if (saved && image && oldImage) deleteImage(oldImage);
  res.json({
    message: 'Mahsulot yangilandi',
  });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const foundedProduct = await productsModel.findById(id);

  if (!foundedProduct) {
    return res.status(404).json({
      message: 'Mahsulot topilmadi',
    });
  }

  await productsModel.findByIdAndDelete(id);
  if (foundedProduct.image) deleteImage(foundedProduct.image);
  res.json({
    message: "Mahsulot o'chirildi",
  });
};

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
