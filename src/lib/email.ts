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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMessageHtml(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, '<br />');
}

export async function sendContactNotification(data: ContactNotificationData) {
  // Skip email sending if no API key configured (development)
  if (!process.env.RESEND_API_KEY) {
    console.log('Resend API key not configured, skipping email notification');
    console.log('Contact form data:', data);
    return;
  }

  try {
    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safePhone = data.phone ? escapeHtml(data.phone) : null;
    const safeSubject = data.subject ? escapeHtml(data.subject) : null;
    const safeMessage = formatMessageHtml(data.message);

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: data.subject || `New Contact Form Submission from ${safeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D4AF37;">New Contact Form Submission</h2>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; width: 120px;">Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <a href="mailto:${safeEmail}" style="color: #D4AF37;">${safeEmail}</a>
              </td>
            </tr>
            ${safePhone ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Phone:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${safePhone}</td>
            </tr>
            ` : ''}
            ${safeSubject ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Subject:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${safeSubject}</td>
            </tr>
            ` : ''}
          </table>

          <h3 style="color: #333; margin-top: 20px;">Message:</h3>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">${safeMessage}</div>

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
