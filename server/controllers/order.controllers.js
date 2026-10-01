const Order = require("../models/order.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");

const createOrder = async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Only customer accounts can place orders" });
        }

        const { products } = req.body || {};
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Add at least one product to your order" });
        }

        const hasInvalidProductId = products.some((item) =>
            !item || typeof item.product !== "string" || !/^[0-9a-fA-F]{24}$/.test(item.product)
        );
        if (hasInvalidProductId) {
            return res.status(400).json({ message: "Your cart contains an outdated product. Remove it and add the product again from the catalogue." });
        }

        const hasInvalidQuantity = products.some((item) =>
            !Number.isInteger(item.quantity) || item.quantity < 1
        );
        if (hasInvalidQuantity) {
            return res.status(400).json({ message: "Order quantities must be whole numbers greater than zero" });
        }

        const hasInvalidObjectId = products.some((item) => !mongoose.Types.ObjectId.isValid(item.product));
        if (hasInvalidObjectId) {
            return res.status(400).json({ message: "One or more products are invalid" });
        }

        const requestedProductIds = [...new Set(products.map((item) => String(item.product)))];
        const databaseProducts = await Product.find({ _id: { $in: requestedProductIds } });
        if (databaseProducts.length !== requestedProductIds.length) {
            return res.status(400).json({ message: "One or more products are no longer available" });
        }

        const productsById = new Map(databaseProducts.map((product) => [String(product._id), product]));
        const orderProducts = products.map((item) => {
            const product = productsById.get(String(item.product));
            return {
                product: product._id,
                quantity: item.quantity,
                calculatedPrice: product.price * item.quantity,
            };
        });

        const order = new Order({ userId: req.user.id, products: orderProducts });
        await order.save();
        await order.populate("products.product");
        res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Failed to create Order", error: error.message });
    }
}
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("userId").populate("products.product");
        res.status(200).json({ message: "Orders fetched successfully", orders });
    } catch (error) {
        res.status(500).json({ message: "Failed to find the orders", error: error.message });
    }
}
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("userId").populate("products.product");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order fetched successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Failed to find the order", error: error.message });
    }
}
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .populate("products.product")
            .sort({ createdAt: -1 });
        res.status(200).json({ message: "Orders fetched successfully", orders });
    } catch (error) {
        res.status(500).json({ message: "Failed to find the orders", error: error.message });
    }
};

module.exports = { getMyOrders, createOrder, getAllOrders, getOrderById };