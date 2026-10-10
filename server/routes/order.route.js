const express = require("express");
const { createOrder, getMyOrders, getAllOrders } = require("../controllers/order.controllers");
const { authenticateUser, adminAuthorization } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/my", authenticateUser, getMyOrders);
router.get("/all", authenticateUser, adminAuthorization, getAllOrders);
router.post("/", authenticateUser, createOrder);

module.exports = router;
