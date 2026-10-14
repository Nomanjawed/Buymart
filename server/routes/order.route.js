const express = require("express");
const {
	createOrder,
	getMyOrders,
	getAllOrders,
	updateOrderStatus,
	trackOrderByNumber,
} = require("../controllers/order.controllers");
const { authenticateUser, adminAuthorization } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/my", authenticateUser, getMyOrders);
router.get("/all", authenticateUser, adminAuthorization, getAllOrders);
router.get("/track/:orderNumber", authenticateUser, trackOrderByNumber);
router.patch("/:orderNumber/status", authenticateUser, adminAuthorization, updateOrderStatus);
router.post("/", authenticateUser, createOrder);

module.exports = router;
