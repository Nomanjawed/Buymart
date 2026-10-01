const Product = require("../models/product.model");

// product name
// product description
// product price
// product category
// product image
// product orderlist

// createProduct   (post)
const createProduct = async (req, res) => {
  const { name, description, price, category, image, isFeatured } = req.body || {};

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
    isFeatured,
  });

  res.status(201).json({ message: "Product has been created", createProduct });
};

// getAllProduct (get)
const getAllProduct = async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = 6;
  const skip = (page - 1) * limit;

  const [products, totalProducts] = await Promise.all([
    Product.find().skip(skip).limit(limit),
    Product.countDocuments(),
  ]);

  res.status(200).json({
    message: "All products",
    products,
    pagination: {
      page,
      limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
    },
  });
};

const getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ isFeatured: true })
    .sort({ updatedAt: -1 })
    .limit(5);

  res.status(200).json({ message: "Featured products", products });
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
const { name, description, price, category, image, isFeatured} = req.body || {};
const id = req.params.id; 
  const updatedProduct= await Product.findByIdAndUpdate(id, {name, description, price, category, image, isFeatured}, { new: true, runValidators: true });
  if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
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
  getFeaturedProducts,
  getSingleProductById,
  updateProduct,
  deleteProduct,
};
