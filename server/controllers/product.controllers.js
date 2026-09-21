const Product = require("../models/product.model");

// product name
// product description
// product price
// product category
// product image
// product orderlist

// createProduct   (post)
const createProduct = async (req, res) => {
  const { name, description, price, category, image } = req.body || {};

  if (!name)
    return res.status(400).json({ message: "Product Name is required" });

  if (!description)
    return res.status(400).json({ message: "Description is required" });

  if (!price) return res.status(400).json({ message: "Price is required" });

  if (!category) return res.status(400).json({ message: "Choose a category" });

  if (!image) return res.status(400).json({ message: "Upload an Image" });

  // createProduct
  const createProduct = await Product.create({
    name,
    description,
    price,
    category,
    image,
  });

  res.status(201).json({ message: "Product has been created", createProduct });
};

// getAllProduct (get)
const getAllProduct = async (req, res) => {
  const products = await Product.find();
  res.status(200).json({ message: "All products", products });
};

// getAllProduct

// getSingleProductById (get)
const getSingleProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.status(200).json({ message: "Single product", product });
};

// getSingleProductById

// updateProduct (patch)
const updateProduct = async (req, res) => {
const { name, description, price, category} = req.body || {};
const id = req.params.id; 
  const updatedProduct= await Product.findByIdAndUpdate(id, {name, description, price, category});
  res.status(200).json({ message: "Product updated successfully", updatedProduct }); 
};

// updateProduct

// deleteProduct (delete)
const deleteProduct = async (req, res) => {
  const id = req.params.id;
  const deleteProduct= await Product.findByIdAndDelete(id);
  res.status(200).json({ message: "Product deleted successfully", deleteProduct });
};
// deleteProduct

module.exports = {
  createProduct,
  getAllProduct,
  getSingleProductById,
  updateProduct,
  deleteProduct,
};
