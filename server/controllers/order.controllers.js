const Order = require("../models/order.model");

const createOrder = async (req, res) => {
    try {
        const { userId, products } = req.body;
        const order = new Order({ userId, products });
        await order.create();
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
const getmyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).populate("products.product"); 
        res.status(200).json({ message: "Orders fetched successfully", orders });
    } catch (error) {
        res.status(500).json({ message: "Failed to find the orders", error: error.message });
    }
}   