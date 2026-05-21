import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import 'dotenv/config';

import { confirmOrder, updateOrderStatus } from "./server/controllers/orderController";
import { startDailySummaryJob } from "./server/jobs/dailySummaryJob";
import { adminDb } from "./server/config/firebase-admin";

// Mock Razorpay initialization (since we may not have genuine keys)
import Razorpay from "razorpay";
let razorpay: Razorpay | null = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const apiRouter = express.Router();

// API Router Routes (without /api prefix)
apiRouter.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

apiRouter.post("/orders/create", async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    if (!razorpay) {
      // Mock order creation if Razorpay isn't configured
      return res.json({
        id: `order_mock_${Date.now()}`,
        currency: "INR",
        amount: amount,
        receipt
      });
    }
    
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: receipt || `receipt_${Date.now()}`
    });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

apiRouter.post("/orders/verify", (req, res) => {
  // Basic verification simulation since this is for demonstration
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (razorpay_order_id && razorpay_payment_id) {
     res.json({ success: true });
  } else {
     res.status(400).json({ success: false, error: "Invalid details" });
  }
});

apiRouter.post("/orders/confirm", confirmOrder);
apiRouter.post("/orders/update-status", updateOrderStatus);

apiRouter.get("/orders/track", async (req, res) => {
  try {
    const { orderId, phone } = req.query;
    if (!orderId || !phone) return res.status(400).json({ error: "Missing parameters" });
    
    const qs = await adminDb.collection("orders").where("orderId", "==", orderId).where("phone", "==", phone).get();
    if (qs.empty) return res.status(404).json({ error: "Order not found" });
    
    const order = qs.docs[0].data();
    // Ensure date object is parsed cleanly
    if (order.createdAt && typeof order.createdAt.toDate === 'function') {
      order.createdAt = order.createdAt.toDate().toISOString();
    }
    res.json({ order });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Mount the apiRouter under both /api and / to handle local and Vercel routing
app.use("/api", apiRouter);
app.use("/", apiRouter);

// Start background jobs (note: on Vercel serverless, cron jobs should ideally be separate, but this is fine for local/render)
if (!process.env.VERCEL) {
  startDailySummaryJob();
}

// Local development or non-Vercel environments
if (!process.env.VERCEL) {
  if (process.env.NODE_ENV !== "production") {
    createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    }).then(vite => {
      app.use(vite.middlewares);
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://0.0.0.0:${PORT}`);
      });
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }
}

export default app;
