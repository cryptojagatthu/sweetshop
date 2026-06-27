import nodemailer from 'nodemailer';
import { adminDb } from '../config/firebase-admin.js';

// Multi-tenant branding configuration interface
interface TenantBranding {
  businessName: string;
  ownerEmail: string;
  logoUrl: string;
  brandColor: string;
  website: string;
}

// Default fallback branding
const DEFAULT_BRANDING: TenantBranding = {
  businessName: 'Sweet Shop',
  ownerEmail: 'cryptojagatthu@gmail.com',
  logoUrl: 'https://via.placeholder.com/150x50?text=Sweet+Shop',
  brandColor: '#4A3225', // brand-brown
  website: 'https://hajisyeedsweets.com'
};

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured: boolean = false;

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
      console.warn('⚠️ SMTP Configuration is missing. Emails will not be sent.');
      this.isConfigured = false;
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: parseInt(SMTP_PORT, 10) === 465, 
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });
    
    this.isConfigured = true;
  }

  /**
   * Fetches the multi-tenant branding configuration from Firestore.
   */
  private async fetchTenantBranding(): Promise<TenantBranding> {
    try {
      const doc = await adminDb.collection('settings').doc('branding').get();
      if (doc.exists) {
        return { ...DEFAULT_BRANDING, ...doc.data() };
      }
    } catch (error) {
      console.error('Failed to fetch tenant branding, using defaults.', error);
    }
    return DEFAULT_BRANDING;
  }

  /**
   * Generic retry wrapper for sending emails to ensure resilience
   */
  private async sendWithRetry(mailOptions: nodemailer.SendMailOptions, retries = 3): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      console.warn('Email Service not configured. Skipping email to:', mailOptions.to);
      return false;
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const info = await this.transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${mailOptions.to} [Attempt ${attempt}] - MessageId: ${info.messageId}`);
        return true;
      } catch (error: any) {
        console.error(`❌ Failed to send email to ${mailOptions.to} [Attempt ${attempt}/${retries}]:`, error.message);
        if (attempt === retries) {
          return false;
        }
        // Exponential backoff
        await new Promise(res => setTimeout(res, attempt * 1000));
      }
    }
    return false;
  }

  /**
   * HTML Template Generator
   */
  private generateHtmlTemplate(branding: TenantBranding, title: string, content: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcfaf8; margin: 0; padding: 0; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 0; overflow: hidden; border-radius: 8px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          .header { background-color: ${branding.brandColor}; padding: 20px; text-align: center; color: #fff; }
          .header img { max-height: 50px; }
          .header h1 { margin: 10px 0 0 0; font-size: 24px; font-weight: normal; }
          .content { padding: 30px; line-height: 1.6; }
          .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #777; }
          .footer a { color: ${branding.brandColor}; text-decoration: none; }
          .data-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
          .data-table th { color: #555; width: 40%; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            ${branding.logoUrl ? `<img src="${branding.logoUrl}" alt="${branding.businessName} Logo">` : ''}
            <h1>${title}</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${branding.businessName}. All rights reserved.</p>
            <p>Visit us at <a href="${branding.website}">${branding.website}</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // ==========================================================
  // NOTIFICATION METHODS
  // ==========================================================

  /**
   * Send Order Confirmation Email
   */
  public async sendOrderEmail(order: any, customerEmail?: string) {
    const branding = await this.fetchTenantBranding();
    const from = process.env.EMAIL_FROM || `"${branding.businessName}" <${process.env.SMTP_USER}>`;
    
    // Format Items
    let itemsHtml = '<ul style="padding-left: 20px;">';
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        itemsHtml += `<li>${item.quantity}x ${item.name} (${item.price} INR)</li>`;
      });
    }
    itemsHtml += '</ul>';

    // ----------------------------------------------------
    // We only send the order details to the shop owner
    // ----------------------------------------------------
    if (branding.ownerEmail) {
      const ownerContent = `
        <p>A new order has been placed on the website!</p>
        <table class="data-table">
          <tr><th>Order Number:</th><td>${order.orderId || 'N/A'}</td></tr>
          <tr><th>Customer Name:</th><td>${order.name}</td></tr>
          <tr><th>Phone:</th><td>${order.phone}</td></tr>
          <tr><th>Customer Email:</th><td>${customerEmail || 'N/A'}</td></tr>
          <tr><th>Amount:</th><td>${order.amount} INR</td></tr>
          <tr><th>Delivery Type:</th><td>${order.deliveryType || 'N/A'}</td></tr>
          <tr><th>Instructions:</th><td>${order.instructions || 'None'}</td></tr>
        </table>
        <h3>Order Items:</h3>
        ${itemsHtml}
      `;

      const ownerHtml = this.generateHtmlTemplate(branding, 'New Order Received', ownerContent);

      await this.sendWithRetry({
        from,
        to: branding.ownerEmail,
        subject: `New Order Alert - ${order.orderId || 'Received'} from ${order.name}`,
        html: ownerHtml
      });
    }
  }

  /**
   * Send Contact Form Email
   */
  public async sendContactFormEmail(data: { name: string; phone: string; email: string; subject: string; message: string; ip?: string }) {
    const branding = await this.fetchTenantBranding();
    const from = process.env.EMAIL_FROM || `"${branding.businessName}" <${process.env.SMTP_USER}>`;

    const sanitizeHtml = (str: string) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    
    const contentHtml = `
      <p>You have received a new message from the contact form.</p>
      <table class="data-table">
        <tr><th>Name:</th><td>${sanitizeHtml(data.name)}</td></tr>
        <tr><th>Phone:</th><td>${sanitizeHtml(data.phone)}</td></tr>
        <tr><th>Email:</th><td>${sanitizeHtml(data.email)}</td></tr>
        <tr><th>Subject:</th><td>${sanitizeHtml(data.subject)}</td></tr>
        <tr><th>Time:</th><td>${new Date().toLocaleString()}</td></tr>
        ${data.ip ? `<tr><th>IP Address:</th><td>${data.ip}</td></tr>` : ''}
      </table>
      <h3>Message:</h3>
      <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid ${branding.brandColor};">${sanitizeHtml(data.message).replace(/\n/g, '<br>')}</p>
    `;

    const html = this.generateHtmlTemplate(branding, 'New Contact Form Submission', contentHtml);

    if (branding.ownerEmail) {
      await this.sendWithRetry({
        from,
        to: branding.ownerEmail,
        replyTo: data.email, // Allows owner to hit "Reply" and email the customer directly
        subject: `Contact Form: ${sanitizeHtml(data.subject)}`,
        html
      });
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
