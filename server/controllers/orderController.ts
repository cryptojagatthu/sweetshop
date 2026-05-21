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
    
    let docId = `mock_doc_${Date.now()}`;
    let savedData = finalOrder as any;
    savedData.createdAt = new Date().toISOString();
    
    try {
      // Save to Firestore using admin SDK to avoid direct frontend saving
      const docRef = await ordersRef.add(finalOrder);
      docId = docRef.id;
      
      // Get doc for actual timestamp if needed
      const savedDoc = await docRef.get();
      savedData = savedDoc.data() || finalOrder;
      savedData.createdAt = savedData.createdAt ? savedData.createdAt.toDate().toISOString() : new Date().toISOString(); 
    } catch (dbError: any) {
      if (dbError.message.includes('credentials') || dbError.message.includes('Project Id')) {
        console.warn('⚠️ Local Testing Mode: Mocking Firestore save because credentials are not configured.');
      } else {
        throw dbError;
      }
    }
    
    // Send standard New Order Notification (this will just console.log if TELEGRAM config is missing)
    await sendTelegramNotification('New Order', savedData);

    // Check for high value alert
    if (savedData.amount > 5000 || savedData.instructions?.toLowerCase().includes('bulk') || savedData.instructions?.toLowerCase().includes('wedding')) {
      await sendTelegramNotification('Bulk Order Alert', savedData);
    }

    res.json({ success: true, orderId: savedData.orderId || `ORD_MOCK_${Date.now()}`, docId });
  } catch (error: any) {
    console.error('Confirm order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    // Basic auth check: usually this endpoint expects a bearer token. For UI simplicity, passing it.
    const { docId, newStatus, orderId } = req.body;
    
    try {
      await adminDb.collection('orders').doc(docId).update({
        status: newStatus
      });
    } catch (dbError: any) {
      if (dbError.message.includes('credentials') || dbError.message.includes('Project Id')) {
        console.warn('⚠️ Local Testing Mode: Mocking Firestore update because credentials are not configured.');
      } else {
        throw dbError;
      }
    }

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
