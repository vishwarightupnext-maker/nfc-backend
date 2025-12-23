import razorpay from "../config/razorpay.js";
import Card from "../models/Card.js";
import { createHmac } from "crypto";

/* =====================================================
   CREATE RAZORPAY ORDER
   (Only logged-in USER, unpaid card, not expired)
===================================================== */
export const createPaymentOrder = async (req, res) => {
  try {
    /* 🔐 AUTH CHECK */
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { cardId } = req.body;

    if (!cardId) {
      return res.status(400).json({ message: "cardId is required" });
    }

    /* 🔎 FIND CARD */
    const card = await Card.findOne({ _id: cardId, userId });

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (card.isPaid) {
      return res.status(400).json({ message: "Card already paid" });
    }

    /* ⏰ EXPIRED CHECK (EXTRA SAFETY) */
    if (card.expiresAt && new Date() > card.expiresAt) {
      return res.status(403).json({ message: "Card expired" });
    }

    /* 💰 CREATE RAZORPAY ORDER */
    const order = await razorpay.orders.create({
      amount: 499 * 100, // ₹499
      currency: "INR",
      receipt: `card_${card._id}`,
    });

    /* 💾 SAVE ORDER ID */
    card.paymentOrderId = order.id;
    await card.save();

    res.json({
      success: true,
      order,
      cardId: card._id,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   VERIFY PAYMENT
===================================================== */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cardId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !cardId
    ) {
      return res.status(400).json({ message: "Missing payment fields" });
    }

    /* 🔐 SIGNATURE VERIFICATION */
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = createHmac(
      "sha256",
      process.env.RAZORPAY_SECRET
    )
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    /* ✅ MARK CARD AS PAID (LIFETIME) */
    await Card.findByIdAndUpdate(cardId, {
      isPaid: true,
      paymentStatus: "paid",
      paymentId: razorpay_payment_id,
      paidAt: new Date(),
      expiresAt: null, // ♾ lifetime
    });

    res.json({
      success: true,
      message: "Payment successful. Card activated.",
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ message: "Payment verification error" });
  }
};
