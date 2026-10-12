import crypto from "node:crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { amount, currency = "INR", receipt, customer } = req.body || {};
    const parsedAmount = Number(amount);

    if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount." });
    }
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: "Razorpay server keys are not configured." });
    }

    const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: parsedAmount * 100,
        currency,
        receipt: String(receipt || `noir-${Date.now()}`).slice(0, 40),
        notes: {
          customer_name: String(customer?.name || "").slice(0, 100),
          customer_email: String(customer?.email || "").slice(0, 100)
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.description || "Razorpay order creation failed." });
    }

    return res.status(200).json({
      id: data.id,
      amount: data.amount,
      currency: data.currency
    });
  } catch {
    return res.status(500).json({ error: "Unable to create Razorpay order." });
  }
}
