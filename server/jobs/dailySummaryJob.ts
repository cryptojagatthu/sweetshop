import cron from 'node-cron';
import { adminDb } from '../config/firebase-admin.js';
import { sendTelegramNotification } from '../services/telegramService.js';
import admin from 'firebase-admin';

export const startDailySummaryJob = () => {
  // Run every day at 10:00 PM
  cron.schedule('0 22 * * *', async () => {
    try {
      console.log('Running daily summary job...');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const ordersSnapshot = await adminDb.collection('orders')
        .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(today))
        .get();

      let ordersCount = 0;
      let revenue = 0;
      let pendingCount = 0;
      let deliveredCount = 0;
      const productCounts: Record<string, number> = {};

      ordersSnapshot.forEach(doc => {
        const order = doc.data();
        ordersCount++;
        revenue += (order.amount || 0);

        if (order.status === 'Delivered') deliveredCount++;
        else if (order.status === 'Accepted' || order.status === 'Preparing') pendingCount++;

        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
             const name = item.name || 'Unknown';
             productCounts[name] = (productCounts[name] || 0) + (item.quantity || 1);
          });
        }
      });

      // Find top 3 most ordered
      const sortedProducts = Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);

      const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

      await sendTelegramNotification('Daily Sales Summary', {
        dateStr,
        ordersCount,
        revenue,
        pendingCount,
        deliveredCount,
        mostOrdered: sortedProducts
      });

    } catch (error) {
      console.error('Error generating daily summary:', error);
    }
  });
};
