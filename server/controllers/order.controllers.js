const Stripe = require("stripe");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");

const stripe = new Stripe(process.env.SECRET_KEY);

const createOrder = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only customer accounts can place orders" });
    }

    const { products, shippingDetails, paymentMethod } = req.body || {};

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "Products must be a non-empty array of { product, quantity } items",
      });
    }

    const hasInvalidProduct = products.some((item) =>
      !item ||
      !mongoose.Types.ObjectId.isValid(item.product) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    );
    if (hasInvalidProduct) {
      return res.status(400).json({
        message: "Each product must include a valid product ID and a positive whole-number quantity",
      });
    }

    if (paymentMethod !== "card" && paymentMethod !== "cod") {
      return res
        .status(400)
        .json({
          message: "Invalid payment method. Choose either 'card' or 'cod'",
        });
    }
   
    const requestedProductIds = [...new Set(products.map((item) => item.product))];
    const databaseProducts = await Product.find({
      _id: { $in: requestedProductIds },
    });
    const productsById = new Map(
      databaseProducts.map((product) => [String(product._id), product]),
    );

    const missingProduct = products.find(
      (item) => !productsById.has(String(item.product)),
    );
    if (missingProduct) {
      return res.status(404).json({
        message: `Product with ID ${missingProduct.product} was not found`,
      });
    }

    const order = await Order.create({
      userId: req.user.id,
      products: products.map((item) => ({
        product: productsById.get(String(item.product))._id,
        quantity: item.quantity,
      })),
      shippingDetails,
      orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    if (paymentMethod === "cod") {
      await order.populate("products.product");
      return res.status(201).json({ message: "Order created successfully", order });
    }

    const lineItems = products.map((item) => {
      const product = productsById.get(String(item.product));
      const unitAmount = Math.round(product.price * 100);

      if (!Number.isSafeInteger(unitAmount) || unitAmount < 1) {
        throw new Error(`Product ${product.name} has an invalid price`);
      }

      return {
        price_data: {
          currency: "pkr",
          product_data: {
            name: product.name,
            description: product.description,
            ...(product.image ? { images: [product.image] } : {}),
          },
          unit_amount: unitAmount * 100,
        },
        quantity: item.quantity,
      };
    });

    const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3000")
      .split(",")[0]
      .trim();

    try {
      const session = await stripe.checkout.sessions.create({
        success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/cancel`,
        line_items: lineItems,
        mode: "payment",
        metadata: {
          orderId: String(order._id),
          userId: String(req.user.id),
        },
      });

      order.stripeCheckoutSessionId = session.id;
      await order.save();

      return res.status(201).json({
        message: "Checkout session created",
        orderNumber: order.orderNumber,
        sessionId: session.id,
        url: session.url,
      });
    } catch (error) {
      await Order.findByIdAndDelete(order._id);
      throw error;
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create Order", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "fullname username email")
      .populate("products.product", "name category image price");
    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to find the orders", error: error.message });
  }
};

const confirmOrderPayment = async (req, res) => {
  try {
    const { sessionId } = req.body || {};
    if (typeof sessionId !== "string" || !sessionId) {
      return res.status(400).json({ message: "Stripe session ID is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.metadata?.userId !== String(req.user.id)) {
      return res.status(403).json({ message: "This checkout session does not belong to you" });
    }

    const order = await Order.findOne({
      _id: session.metadata?.orderId,
      userId: req.user.id,
      stripeCheckoutSessionId: session.id,
    });
    if (!order) {
      return res.status(404).json({ message: "Order for this checkout session was not found" });
    }

    if (session.payment_status !== "paid") {
      return res.status(409).json({
        message: "Payment has not been completed",
        paymentStatus: order.paymentStatus,
      });
    }

    if (order.paymentStatus !== "paid") {
      order.paymentStatus = "paid";
      order.stripePaymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || null;
      await order.save();
    }

    await order.populate("products.product");
    return res.status(200).json({
      message: "Payment confirmed",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to confirm payment",
      error: error.message,
    });
  }
};
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId")
      .populate("products.product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order fetched successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to find the order", error: error.message });
  }
};
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("products.product")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to find the orders", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { orderStatus: requestedStatus } = req.body || {};
    const orderStatus =
      typeof requestedStatus === "string"
        ? requestedStatus.toLowerCase()
        : requestedStatus;
    const allowedStatuses = Order.schema.path("orderStatus").enumValues;

    if (!allowedStatuses.includes(orderStatus)) {
      return res
        .status(400)
        .json({ message: "Invalid order status", allowedStatuses });
    }

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    if (order.paymentMethod === "cod" && orderStatus === "delivered") {
      order.paymentStatus = "paid";
    }
    await order.save();

    return res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update order status", error: error.message });
  }
};

const trackOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
      userId: req.user.id,
    }).select("orderNumber orderStatus createdAt updatedAt");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res
      .status(200)
      .json({ message: "Order tracking fetched successfully", order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to track order", error: error.message });
  }
};

module.exports = {
  getMyOrders,
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  trackOrderByNumber,
  confirmOrderPayment,
};
