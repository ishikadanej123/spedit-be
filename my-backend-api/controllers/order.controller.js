const razorpay = require("../config/razorpay");
const { Order } = require("../models");
const crypto = require("crypto");

const createorder = async (req, res) => {
  try {
    const { userId, userDetails, productDetails, totalAmount } = req.body;

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const dbOrder = await Order.create({
      userId,
      userDetails,
      productDetails,
      totalAmount,
    });
    return res.status(201).json({
      success: true,
      msg: "Order created successfully",
      orderId: dbOrder.id,
      razorpayOrderId: razorpayOrder.id,
      razorpayKey: "rzp_test_R8gS9ZJTVh3SPF",
      productDetails,
      userDetails,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Something went wrong", error });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", "KZynmSCbuoMgXYyUN9KaBdcF")
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, msg: "Payment verification failed" });
    }

    await Order.update(
      { paymentStatus: "Paid", razorpayPaymentId: razorpay_payment_id },
      { where: { id: orderId } }
    );

    return res.status(200).json({
      success: true,
      msg: "Payment verified successfully",
      razorpay_order_id,
      razorpay_payment_id,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Something went wrong", error });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({ where: { userId: Number(userId) } });

    return res.status(200).json({
      msg: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
      error,
    });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.findAll({
      where: { userId: Number(userId) },
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No orders found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders by userId:", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
      error,
    });
  }
};

const getAllUsersOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    return res.status(200).json({
      success: true,
      msg: "All users' orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching all users' orders:", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
      error,
    });
  }
};

module.exports = {
  createorder,
  verifyPayment,
  getAllOrders,
  getOrdersByUserId,
  getAllUsersOrders,
};
