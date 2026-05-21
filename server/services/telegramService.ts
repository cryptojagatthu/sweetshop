import axios from 'axios';
import { adminDb } from '../config/firebase-admin';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const DEFAULT_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export type NotificationType = 
| 'New Order' 
| 'Order Accepted' 
| 'Preparing'
| 'Out for Delivery'
| 'Delivered'
| 'Cancelled'
| 'Bulk Order Alert'
| 'Daily Sales Summary';

export const sendTelegramNotification = async (type: NotificationType, data: any, retryCount = 0): Promise<boolean> => {
  // Wait, first fetch settings from db to get chat_id and if enabled
  let chatId = DEFAULT_CHAT_ID;
  let enabled = true;
  
  try {
    const settingsDoc = await adminDb.collection('settings').doc('notifications').get();
    if (settingsDoc.exists) {
      const settings = settingsDoc.data();
      if (settings?.telegramChatId) chatId = settings.telegramChatId;
      
      // Check if specific type is enabled
      const settingsMapping: Record<NotificationType, string> = {
        'New Order': 'newOrderEnabled',
        'Order Accepted': 'statusEnabled',
        'Preparing': 'statusEnabled',
        'Out for Delivery': 'statusEnabled',
        'Delivered': 'statusEnabled',
        'Cancelled': 'statusEnabled',
        'Bulk Order Alert': 'bulkEnabled',
        'Daily Sales Summary': 'dailyEnabled'
      };
      
      const settingKey = settingsMapping[type];
      if (settings && typeof settings[settingKey] === 'boolean') {
        enabled = settings[settingKey];
      }
    }
  } catch (error) {
    console.error('Error fetching notification settings:', error);
  }

  if (!enabled || !BOT_TOKEN || !chatId) {
    if (!BOT_TOKEN || !chatId) {
      console.warn('Telegram credentials not configured. Skipping notification.');
    }
    return false;
  }

  const message = formatMessage(type, data);
  if (!message) return false;

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });

    await logNotification({
      orderId: data.orderId || null,
      notificationType: type,
      message,
      recipient: chatId,
      status: 'sent'
    });
    
    return true;
  } catch (error: any) {
    console.error(`Telegram API Error (Attempt ${retryCount + 1}):`, error.message);
    
    if (retryCount < 2) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // simple backoff
      return sendTelegramNotification(type, data, retryCount + 1);
    }
    
    await logNotification({
      orderId: data.orderId || null,
      notificationType: type,
      message,
      recipient: chatId,
      status: 'failed',
      failureReason: error.message
    });
    return false;
  }
};

const formatMessage = (type: NotificationType, data: any): string => {
  switch (type) {
    case 'New Order': {
      const dateStr = data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';
      const timeStr = data.createdAt ? new Date(data.createdAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }) : 'N/A';
      
      const itemsList = (data.items || []).map((i: any) => `• ${i.weight || ''} ${i.name} ×${i.quantity}`).join('\n');
      
      // Calculate delivery and subtotal correctly if needed, for simplicity assume amount includes delivery. 
      // If delivery is hardcoded as 50 or 0 from frontend:
      const subTotal = (data.items || []).reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
      const delivery = data.amount > subTotal ? data.amount - subTotal : 0;

      return `🔔 <b>HAJI SYEED PURE GHEE SWEETS</b>\n\n<b>NEW ORDER RECEIVED</b>\n\n<b>Order ID:</b>\n#${data.orderId}\n\n<b>Customer:</b>\n${data.customerName}\n\n<b>Phone:</b>\n${data.phone}\n\n<b>Items:</b>\n\n${itemsList}\n\n<b>Subtotal:</b>\n₹${subTotal}\n\n<b>Delivery:</b>\n₹${delivery}\n\n<b>Total:</b>\n₹${data.amount}\n\n<b>Payment:</b>\n${data.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid via ' + data.paymentMethod}\n\n<b>Delivery Type:</b>\n${data.deliveryType}\n\n<b>Address:</b>\n${data.address || 'N/A'}\n${data.city || 'N/A'}\n\n<b>Special Instructions:</b>\n${data.instructions || 'None'}\n\n<b>Date:</b>\n${dateStr}\n\n<b>Time:</b>\n${timeStr}`;
    }
    case 'Order Accepted':
      return `✅ <b>Order #${data.orderId} Accepted</b>`;
    case 'Preparing':
      return `👨‍🍳 <b>Order #${data.orderId} Preparing</b>`;
    case 'Out for Delivery':
      return `🚚 <b>Order #${data.orderId} Out For Delivery</b>`;
    case 'Delivered':
      return `🎉 <b>Order #${data.orderId} Delivered</b>`;
    case 'Cancelled':
      return `❌ <b>Order #${data.orderId} Cancelled</b>`;
    case 'Bulk Order Alert':
      return `🔥 <b>HIGH VALUE ORDER ALERT</b>\n\n<b>Order ID:</b>\n#${data.orderId}\n\n<b>Customer:</b>\n${data.customerName}\n\n<b>Phone:</b>\n${data.phone}\n\n<b>Amount:</b>\n₹${data.amount?.toLocaleString('en-IN')}\n\n<b>Order Type:</b>\n${data.amount > 5000 ? 'High Value Order' : 'Bulk Order'}`;
    case 'Daily Sales Summary':
      const listStr = (data.mostOrdered || []).map((i: string) => `• ${i}`).join('\n');
      return `📊 <b>DAILY SALES SUMMARY</b>\n\n<b>Date:</b>\n${data.dateStr}\n\n<b>Orders Today:</b>\n${data.ordersCount}\n\n<b>Revenue:</b>\n₹${data.revenue?.toLocaleString('en-IN')}\n\n<b>Pending:</b>\n${data.pendingCount}\n\n<b>Delivered:</b>\n${data.deliveredCount}\n\n<b>Most Ordered Products:</b>\n\n${listStr || 'None'}`;
    default:
      return '';
  }
};

const logNotification = async (payload: any) => {
  try {
    await adminDb.collection('logs_notifications').add({
      notificationId: `notif_${Date.now()}_${Math.floor(Math.random()*1000)}`,
      timestamp: new Date().toISOString(),
      ...payload
    });
  } catch (error) {
    console.error('Failed to log notification', error);
  }
};
