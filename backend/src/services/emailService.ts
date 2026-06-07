import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      console.warn('Email service not configured - SMTP credentials missing. Emails will be logged to console.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.log(`[EMAIL MOCK] To: ${options.to} | Subject: ${options.subject}`);
      console.log(`[EMAIL MOCK] Body preview: ${options.html.substring(0, 200)}...`);
      return true; // Return true so business logic continues
    }

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      });
      console.log('Email sent to:', options.to);
      return true;
    } catch (error) {
      console.error('Email send failed:', error);
      return false;
    }
  }

  async sendBookingConfirmation(email: string, data: { 
    guestName: string; roomName: string; checkIn: string; checkOut: string; bookingId: string 
  }) {
    return this.sendEmail({
      to: email,
      subject: 'Booking Confirmed - Four Leaf Resort',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #d4af37; margin: 0; font-size: 28px;">Four Leaf Resort</h1>
            <p style="color: #94a3b8; margin: 8px 0 0; font-size: 13px; letter-spacing: 2px;">LUXURY & NATURE</p>
          </div>
          <div style="background: #ffffff; padding: 35px; border: 1px solid #e2e8f0; border-top: none;">
            <div style="text-align: center; margin-bottom: 25px;">
              <div style="background: #dcfce7; color: #16a34a; display: inline-block; padding: 8px 20px; border-radius: 20px; font-weight: 600; font-size: 14px;">✓ Booking Confirmed</div>
            </div>
            <p style="color: #334155; font-size: 16px;">Dear <strong>${data.guestName}</strong>,</p>
            <p style="color: #475569; line-height: 1.6;">Your booking has been confirmed by the resort. We look forward to welcoming you!</p>
            <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #e2e8f0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;">Booking ID</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600; text-align: right; font-family: monospace;">${data.bookingId}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0;">Room</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600; text-align: right; border-top: 1px solid #e2e8f0;">${data.roomName}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0;">Check-in</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600; text-align: right; border-top: 1px solid #e2e8f0;">${data.checkIn}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0;">Check-out</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600; text-align: right; border-top: 1px solid #e2e8f0;">${data.checkOut}</td></tr>
              </table>
            </div>
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">If you have any questions or special requests, please don't hesitate to contact us.</p>
          </div>
          <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; background: #f1f5f9; border-radius: 0 0 12px 12px;">
            <p style="margin: 0;">© 2026 Four Leaf Resort. All rights reserved.</p>
          </div>
        </div>
      `
    });
  }

  async sendBookingRejection(email: string, data: { 
    guestName: string; roomName: string; reason?: string; bookingId: string 
  }) {
    return this.sendEmail({
      to: email,
      subject: 'Booking Update - Four Leaf Resort',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #d4af37; margin: 0; font-size: 28px;">Four Leaf Resort</h1>
            <p style="color: #94a3b8; margin: 8px 0 0; font-size: 13px; letter-spacing: 2px;">LUXURY & NATURE</p>
          </div>
          <div style="background: #ffffff; padding: 35px; border: 1px solid #e2e8f0; border-top: none;">
            <div style="text-align: center; margin-bottom: 25px;">
              <div style="background: #fef2f2; color: #dc2626; display: inline-block; padding: 8px 20px; border-radius: 20px; font-weight: 600; font-size: 14px;">Booking Request Declined</div>
            </div>
            <p style="color: #334155; font-size: 16px;">Dear <strong>${data.guestName}</strong>,</p>
            <p style="color: #475569; line-height: 1.6;">We regret to inform you that your booking request has been declined.</p>
            <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #e2e8f0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;">Booking ID</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600; text-align: right; font-family: monospace;">${data.bookingId}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0;">Room</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600; text-align: right; border-top: 1px solid #e2e8f0;">${data.roomName}</td></tr>
                ${data.reason ? `<tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0;">Reason</td><td style="padding: 8px 0; color: #dc2626; font-weight: 500; text-align: right; border-top: 1px solid #e2e8f0;">${data.reason}</td></tr>` : ''}
              </table>
            </div>
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">Please feel free to make another booking or contact us for assistance.</p>
          </div>
          <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; background: #f1f5f9; border-radius: 0 0 12px 12px;">
            <p style="margin: 0;">© 2026 Four Leaf Resort. All rights reserved.</p>
          </div>
        </div>
      `
    });
  }

  async sendCheckInConfirmation(email: string, data: {
    guestName: string; roomName: string; roomNumber?: string; checkOut: string;
  }) {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to Four Leaf Resort - Check-in Confirmed',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #d4af37; margin: 0; font-size: 28px;">Four Leaf Resort</h1>
          </div>
          <div style="background: #ffffff; padding: 35px; border: 1px solid #e2e8f0; border-top: none;">
            <h2 style="color: #0f172a; text-align: center;">Welcome, ${data.guestName}! 🎉</h2>
            <p style="color: #475569; text-align: center;">Your check-in has been completed successfully.</p>
            <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #e2e8f0;">
              <p><strong>Room:</strong> ${data.roomName}${data.roomNumber ? ` (${data.roomNumber})` : ''}</p>
              <p><strong>Check-out:</strong> ${data.checkOut}</p>
            </div>
            <p style="color: #475569;">We hope you have a wonderful stay!</p>
          </div>
        </div>
      `
    });
  }

  async sendOTPEmail(email: string, otp: string) {
    return this.sendEmail({
      to: email,
      subject: 'OTP Verification - Four Leaf Resort',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #d4af37; margin: 0; font-size: 28px;">Four Leaf Resort</h1>
          </div>
          <div style="background: #ffffff; padding: 35px; border: 1px solid #e2e8f0; border-top: none; text-align: center;">
            <h2 style="color: #0f172a;">Verify Your Identity</h2>
            <p style="color: #475569;">Your one-time verification code is:</p>
            <div style="background: #0f172a; color: #d4af37; font-size: 36px; font-weight: bold; padding: 20px 30px; border-radius: 10px; letter-spacing: 10px; margin: 25px auto; display: inline-block;">
              ${otp}
            </div>
            <p style="color: #94a3b8; font-size: 13px;">This code expires in 10 minutes.</p>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">If you did not request this code, please ignore this email.</p>
          </div>
        </div>
      `
    });
  }
}

export const emailService = new EmailService();
