import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
} from "../controllers/paymentController.js";
import  auth  from "../middlewares/auth.js";

const router = express.Router();

/**
 * User clicks PAY from My Cards page
 * → creates Razorpay order
 */
router.post("/order", auth ,  createPaymentOrder);

/**
 * Razorpay payment success
 * → verify & activate card
 */
router.post("/verify", auth ,  verifyPayment);

export default router;
