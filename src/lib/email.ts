import { Resend } from 'resend';

const FROM_EMAIL = 'Saheeb Website <noreply@saheeb.com>';
const TO_EMAIL = 'contact@saheeb.com';

interface ContactNotificationData {
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
}

export async function sendContactNotification(data: ContactNotificationData) {
  // Skip email sending if no API key configured (development)
  if (!process.env.RESEND_API_KEY) {
    console.log('Resend API key not configured, skipping email notification');
    console.log('Contact form data:', data);
    return;
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: data.subject || `New Contact Form Submission from ${data.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D4AF37;">New Contact Form Submission</h2>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; width: 120px;">Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <a href="mailto:${data.email}" style="color: #D4AF37;">${data.email}</a>
              </td>
            </tr>
            ${data.phone ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Phone:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.phone}</td>
            </tr>
            ` : ''}
            ${data.subject ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Subject:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.subject}</td>
            </tr>
            ` : ''}
          </table>

          <h3 style="color: #333; margin-top: 20px;">Message:</h3>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; white-space: pre-wrap;">${data.message}</div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #999; font-size: 12px;">
            This email was sent from the Saheeb website contact form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send contact notification email:', error);
    }
  } catch (error) {
    console.error('Error sending contact notification email:', error);
  }
}
