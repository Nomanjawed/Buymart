const Stripe  = require("stripe");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");


const stripe = new Stripe(
  process.env.SECRET_KEY
);




const createOrder = async (req, res) => {
    try {
        // if (req.user.role !== "user") {
        //     return res.status(403).json({ message: "Only customer accounts can place orders" });
        // }

        const { products, shippingDetails, paymentMethod } = req.body || {};

        console.log("product",products);
        console.log("shippingDetails",shippingDetails);
        console.log("paymentMethod",paymentMethod);

        if (paymentMethod !== "card" && paymentMethod !== "cod") {
            return res.status(400).json({ message: "Invalid payment method. Choose either 'card' or 'cod'" });
        }
        if (paymentMethod === "card") {
            const lineItems = await Promise.all(products.map(async (item) => {
                const product = await Product.findById(item.product);
                if (!product) {
                    throw new Error(`Product with ID ${item.product} not found`);
                }
            }));
            const session = await stripe.checkout.sessions.create({
  success_url: 'https://example.com/success',
  line_items: [
    {
      price: '{{PRICE_ID}}',
      quantity: 2,
    },
  ],
  mode: 'payment',
});
        }

        // if (!Array.isArray(products) || products.length === 0) {
        //     return res.status(400).json({ message: "Add at least one product to your order" });
        // }

        // const hasInvalidProductId = products.some((item) =>
        //     !item || typeof item.product !== "string" || !/^[0-9a-fA-F]{24}$/.test(item.product)
        // );
        // if (hasInvalidProductId) {
        //     return res.status(400).json({ message: "Your cart contains an outdated product. Remove it and add the product again from the catalogue." });
        // }

        // const hasInvalidQuantity = products.some((item) =>
        //     !Number.isInteger(item.quantity) || item.quantity < 1
        // );
        // if (hasInvalidQuantity) {
        //     return res.status(400).json({ message: "Order quantities must be whole numbers greater than zero" });
        // }

        // const hasInvalidObjectId = products.some((item) => !mongoose.Types.ObjectId.isValid(item.product));
        // if (hasInvalidObjectId) {
        //     return res.status(400).json({ message: "One or more products are invalid" });
        // }

        // const requestedProductIds = [...new Set(products.map((item) => String(item.product)))];
        // const databaseProducts = await Product.find({ _id: { $in: requestedProductIds } });
        // if (databaseProducts.length !== requestedProductIds.length) {
        //     return res.status(400).json({ message: "One or more products are no longer available" });
        // }
        // //  new section
       
        // const requiredFields = ["fullName", "phone", "address", "city", "postalCode"]

        // for (const field of requiredFields) {
        //     if (!shippingDetails[field]) {
        //         return res.status(400).json({ message: `Shipping detail '${field}' is required` });
        //     }
        // }

        // const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // const orderStatus = "pending";

        // const productsById = new Map(databaseProducts.map((product) => [String(product._id), product]));
        // const orderProducts = products.map((item) => {
        //     const product = productsById.get(String(item.product));
        //     return {
        //         product: product._id,
        //         quantity: item.quantity,
        //         calculatedPrice: product.price * item.quantity,
        //     };
        // });

    
        // const order = new Order({ userId: req.user.id, products: orderProducts, shippingDetails, orderNumber, orderStatus });
        // await order.save();
        // await order.populate("products.product");
        // res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Failed to create Order", error: error.message });
    }

}












































const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("userId", "fullname username email")
            .populate("products.product", "name category image price");
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

  const updateOrderStatus = async (req, res) => {
    try {
      const { orderNumber } = req.params;
      const { orderStatus } = req.body || {};
      const allowedStatuses = Order.schema.path("orderStatus").enumValues;

      if (!allowedStatuses.includes(orderStatus)) {
        return res.status(400).json({ message: "Invalid order status", allowedStatuses });
      }

      const order = await Order.findOneAndUpdate(
        { orderNumber },
        { $set: { orderStatus } },
        { new: true, runValidators: true }
      );

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
      return res.status(500).json({ message: "Failed to update order status", error: error.message });
    }
  };

  const trackOrderByNumber = async (req, res) => {
    try {
            const order = await Order.findOne({
                orderNumber: req.params.orderNumber,
                userId: req.user.id,
            })
        .select("orderNumber orderStatus createdAt updatedAt");

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json({ message: "Order tracking fetched successfully", order });
    } catch (error) {
      return res.status(500).json({ message: "Failed to track order", error: error.message });
    }
  };








module.exports = {
  getMyOrders,
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  trackOrderByNumber,
};