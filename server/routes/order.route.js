const express = require("express");
const { getMyOrders } = require("../controllers/order.controllers");
const { authenticateUser } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/my", authenticateUser, getMyOrders);

module.exports = router;
