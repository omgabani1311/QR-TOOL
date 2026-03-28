
export default async function handler(req, res) {
  if (req.method === "POST") {
    const event = req.body;

    console.log("Webhook:", event);

    if (event.event === "payment.captured") {
      console.log("Payment success");
      // Firebase update
    }

    return res.status(200).json({ status: "ok" });
  }

  res.status(405).send("Method Not Allowed");
}

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");

// TODO: Initialize Firebase Admin using your service account
// const serviceAccount = require("./firebase-service-account.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
// const db = admin.firestore();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Built-in body parser for JSON

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Replace with your Razorpay Webhook Secret from the Dashboard
const RAZORPAY_WEBHOOK_SECRET = "YOUR_WEBHOOK_SECRET_HERE";

app.post("/webhook", async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === signature) {
      const event = req.body;

      if (event.event === "subscription.charged" || event.event === "payment.captured") {
        const paymentData = event.payload.payment.entity;

        // Extract user context passed during frontend checkout
        const userUid = paymentData.notes ? paymentData.notes.userId : null;
        const plan = paymentData.notes ? paymentData.notes.plan : "monthly";

        if (userUid) {
          console.log(`Payment confirmed for user ${userUid}. Updating Firestore...`);

          let expiryDate = new Date();
          if (plan === 'yearly') {
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
          } else {
            expiryDate.setMonth(expiryDate.getMonth() + 1);
          }

          // Uncomment to actually write to Firestore once Admin SDK is configured:
          // await db.collection("users").doc(userUid).set({
          //   plan: plan,
          //   expiry: expiryDate.toISOString(),
          //   active: true,
          //   lastPaymentId: paymentData.id
          // }, { merge: true });

          console.log("User successfully granted access via Webhook!");
        }
      }
      res.status(200).send("Webhook Received");
    } else {
      res.status(400).send("Invalid Signature");
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
