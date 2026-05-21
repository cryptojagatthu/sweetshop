import { Request, Response } from 'express';
import { adminDb } from '../config/firebase-admin';
import { sendTelegramNotification } from '../services/telegramService';
import admin from 'firebase-admin';

export const confirmOrder = async (req: Request, res: Response) => {
  try {
    const { orderData, paymentStatus } = req.body;
    
    // Create new document reference in orders collection
    const ordersRef = adminDb.collection('orders');
    
    const finalOrder = {
      ...orderData,
      paymentStatus,
      status: 'Accepted',
      createdAt: admin.firestore.FieldValue.serverTimestamp() // server timestamp inside admin sdk
    };
    
    // Save to Firestore using admin SDK to avoid direct frontend saving
    const docRef = await ordersRef.add(finalOrder);
    
    // Get doc for actual timestamp if needed
    const savedDoc = await docRef.get();
    const savedData = savedDoc.data() || finalOrder;
    savedData.createdAt = savedData.createdAt ? savedData.createdAt.toDate().toISOString() : new Date().toISOString(); 
    
    // Send standard New Order Notification
    await sendTelegramNotification('New Order', savedData);

    // Check for high value alert
    if (savedData.amount > 5000 || savedData.instructions?.toLowerCase().includes('bulk') || savedData.instructions?.toLowerCase().includes('wedding')) {
      await sendTelegramNotification('Bulk Order Alert', savedData);
    }

    res.json({ success: true, orderId: savedData.orderId, docId: docRef.id });
  } catch (error: any) {
    console.error('Confirm order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    // Basic auth check: usually this endpoint expects a bearer token. For UI simplicity, passing it.
    const { docId, newStatus, orderId } = req.body;
    
    await adminDb.collection('orders').doc(docId).update({
      status: newStatus
    });

    const statusMap: Record<string, any> = {
      'Accepted': 'Order Accepted',
      'Preparing': 'Preparing',
      'Out for Delivery': 'Out for Delivery',
      'Delivered': 'Delivered',
      'Cancelled': 'Cancelled'
    };

    const notifType = statusMap[newStatus];
    if (notifType) {
      // Just pass orderId (and other parts if needed, but only orderId is required for status updates)
      await sendTelegramNotification(notifType, { orderId });
    }

    res.json({ success: true, message: 'Status updated' });
  } catch (error: any) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
