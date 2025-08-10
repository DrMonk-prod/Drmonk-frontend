const crypto = require("crypto");

const validateRazorpayPayment = (
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
) => {
  // Check for missing fields
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return false; // Invalid request
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return false; // Signature mismatch
  }

  console.log("Payment signature verified successfully.");
  return true; // Signature is valid
};

module.exports = validateRazorpayPayment;
