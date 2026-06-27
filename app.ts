import express from "express";
import path from "path";
import cors from "cors";
import compression from "compression";
import 'dotenv/config';

import { confirmOrder, updateOrderStatus } from "./server/controllers/orderController.js";
import { startDailySummaryJob } from "./server/jobs/dailySummaryJob.js";
import { adminDb, adminAuth } from "./server/config/firebase-admin.js";

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

app.use(compression());
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

apiRouter.get("/orders/history", async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ error: "Missing phone number" });
    
    // Privacy: Only return necessary fields, not the full address details for history view
    const qs = await adminDb.collection("orders")
      .where("phone", "==", phone)
      .get();
      
    if (qs.empty) return res.json({ orders: [] });
    
    // 🚀 FIXED: Firestore requires a manual composite index if we use .where() and .orderBy() together.
    // To avoid crashing or requiring the owner to manually configure Firebase, we sort it in memory.
    const sortedDocs = qs.docs.sort((a, b) => {
       const dataA = a.data();
       const dataB = b.data();
       const timeA = dataA.createdAt && typeof dataA.createdAt.toDate === 'function' ? dataA.createdAt.toDate().getTime() : new Date(dataA.createdAt || 0).getTime();
       const timeB = dataB.createdAt && typeof dataB.createdAt.toDate === 'function' ? dataB.createdAt.toDate().getTime() : new Date(dataB.createdAt || 0).getTime();
       return timeB - timeA;
    }).slice(0, 10);
    
    const orders = sortedDocs.map(doc => {
      const data = doc.data();
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        data.createdAt = data.createdAt.toDate().toISOString();
      }
      return {
        orderId: data.orderId,
        date: data.createdAt,
        amount: data.amount,
        status: data.status,
        items: data.items,
        deliveryType: data.deliveryType,
        paymentMethod: data.paymentMethod
      };
    });
    
    res.json({ orders });
  } catch (e: any) {
    console.error("Error fetching history", e);
    res.status(500).json({ error: e.message });
  }
});

// Admin Dashboard - Secure route to fetch all orders bypassing Firestore client rules
apiRouter.get("/admin/orders", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized: Missing token" });
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    try {
      // Verify the token to ensure the user is logged into Firebase Auth
      await adminAuth.verifyIdToken(token);
    } catch (authError) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
    
    // Fetch all orders (adminDb bypasses security rules)
    const qs = await adminDb.collection("orders").orderBy("createdAt", "desc").get();
    
    const orders = qs.docs.map(doc => {
      const data = doc.data();
      // Ensure timestamps are correctly converted for the frontend
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
         data.createdAt = data.createdAt.toDate().toISOString();
      }
      return { id: doc.id, ...data };
    });
    
    res.json({ success: true, orders });
  } catch (e: any) {
    console.error("Admin fetch error", e);
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
    import("vite").then(({ createServer: createViteServer }) => {
      createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      }).then(vite => {
        app.use(vite.middlewares);
        app.listen(PORT, "0.0.0.0", () => {
          console.log(`Server running on http://0.0.0.0:${PORT}`);
        });
      });
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { maxAge: '1y', immutable: true }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }
}

export default app;
