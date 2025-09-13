const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();
const orderController = require("../controllers/order.controller");

router.post("/create-order", authMiddleware, orderController.createorder);
router.post("/verify-payment", orderController.verifyPayment);
router.get("/getorders", authMiddleware, orderController.getAllOrders);
router.get("/all-orders", isAdmin, orderController.getAllUsersOrders);
// router.get("/:userId", orderController.getOrdersByUserId);
router.get("/pincode", orderController.getOrdersByPincode);
router.get("/:orderId", orderController.getOrderById);
router.put("/orderstatus/:orderId", isAdmin, orderController.updateOrderStatus);

module.exports = router;
