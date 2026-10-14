const { default: Stripe } = require("stripe");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");


const stripe = new Stripe(
  process.env.SECRET_KEY
);

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
        //  new section
        const shippingDetails = req.body.shippingDetails || {};
        const requiredFields = ["fullName", "phone", "address", "city", "postalCode"]

        for (const field of requiredFields) {
            if (!shippingDetails[field]) {
                return res.status(400).json({ message: `Shipping detail '${field}' is required` });
            }
        }

        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const orderStatus = "pending";

        const productsById = new Map(databaseProducts.map((product) => [String(product._id), product]));
        const orderProducts = products.map((item) => {
            const product = productsById.get(String(item.product));
            return {
                product: product._id,
                quantity: item.quantity,
                calculatedPrice: product.price * item.quantity,
            };
        });

        const order = new Order({ userId: req.user.id, products: orderProducts, shippingDetails, orderNumber, orderStatus });
        await order.save();
        await order.populate("products.product");
        res.status(201).json({ message: "Order created successfully", order });
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
      const order = await Order.findOne({ orderNumber: req.params.orderNumber })
        .select("orderNumber orderStatus createdAt updatedAt");

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json({ message: "Order tracking fetched successfully", order });
    } catch (error) {
      return res.status(500).json({ message: "Failed to track order", error: error.message });
    }
  };




const createDonation = async (req, res) => {
  try {
    const { amount, driveId } = req.body;
    const userId = req.user.id;

    if (!amount || isNaN(amount) || amount < 200) {
      return res.status(400).json({ message: "Invalid amount or less than 200" });
    }

    if (driveId) {
      const drive = await Drive.findById(driveId);
      if (!drive) return res.status(404).json({ message: "Drive not found" });
    }
    const BASE_URL = process.env.BASE_URL || process.env.LOCAL_BASE_URL;


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "pkr", 
            product_data: {
              name: driveId ? "Drive Donation" : "General Donation",
            },
            unit_amount: amount * 100, 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${BASE_URL}/donation/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/donation/cancel`,
      metadata: {
        userId: userId.toString(),
        driveId: driveId ? driveId.toString() : "",
        amount: amount.toString(),
      },
    });

    return res.status(200).json({
      message: "Checkout session created",
      sessionId: session.id,
      url: session.url, 
    });
  } catch (error) {
    console.error("Error creating donation session:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};




const confirmDonation = async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ message: "Missing session ID" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const { userId, driveId, amount } = session.metadata;

    const existing = await Donation.findOne({ stripePaymentId: session.id });
    if (existing) {
      return res.status(200).json({ message: "Donation already recorded" });
    }

    const donation = await Donation.create({
      amount: parseFloat(amount),
      donatedBy: userId,
      drive: driveId || null,
      stripePaymentId: session.id,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { donations: donation._id }
    });

    if (driveId) {
      await Drive.findByIdAndUpdate(driveId, {
        $push: { donations: donation._id }
      });
    }

    const populatedDonation = await Donation.findById(donation._id)
      .populate("donatedBy", "name email username")
      .populate("drive", "title date createdBy")
      .populate({
        path: "drive",
        populate: {
          path: "createdBy",
          select: "name email username"
        }
      });

    return res.status(201).json({
      message: "Donation confirmed and recorded",
      donation: populatedDonation
    });

  } catch (error) {
    console.error("Error confirming donation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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