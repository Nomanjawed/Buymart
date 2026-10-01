const express = require("express");
const { createOrder, getMyOrders } = require("../controllers/order.controllers");
const { authenticateUser } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/my", authenticateUser, getMyOrders);
router.post("/", authenticateUser, createOrder);

module.exports = router;
