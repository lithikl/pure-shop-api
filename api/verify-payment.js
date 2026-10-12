import crypto from "node:crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ verified: false, error: "Incomplete payment verification data." });
    }
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ verified: false, error: "Razorpay server secret is not configured." });
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const valid = expected.length === razorpay_signature.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));

    if (!valid) return res.status(400).json({ verified: false, error: "Invalid payment signature." });

    return res.status(200).json({
      verified: true,
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id
    });
  } catch {
    return res.status(500).json({ verified: false, error: "Unable to verify payment." });
  }
}
