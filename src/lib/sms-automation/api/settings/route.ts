import { NextRequest, NextResponse } from 'next/server';
import { getMaskedSettings, updateSettings, getDecryptedSettings } from '../../lib/settings';
import { verifyAdminAuth } from '../../lib/auth';
import { hashPassword } from '../../lib/crypto';
import { getErrorResponse } from '../../utils/errors';
import { resetTwilioClient } from '../../integrations/twilio';
import { resetSendGridState } from '../../integrations/sendgrid';

/**
 * GET /api/sms-automation/settings
 * Returns settings with sensitive values masked.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdminAuth(request);
    if (!auth.authorized) return auth.response!;

    const settings = await getMaskedSettings();
    return NextResponse.json(settings);
  } catch (error) {
    const { message, code, status } = getErrorResponse(error);
    return NextResponse.json({ error: message, code }, { status });
  }
}

/**
 * PUT /api/sms-automation/settings
 * Update settings. Encrypts sensitive fields automatically.
 */
export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAdminAuth(request);
    if (!auth.authorized) return auth.response!;

    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json(
        { error: 'section and data are required' },
        { status: 400 }
      );
    }

    const updateMap: Record<string, unknown> = {};

    switch (section) {
      case 'twilio':
        if (data.accountSid) updateMap.twilioAccountSid = data.accountSid;
        if (data.authToken) updateMap.twilioAuthToken = data.authToken;
        if (data.phoneNumber) updateMap.twilioPhoneNumber = data.phoneNumber;
        resetTwilioClient();
        break;

      case 'sendgrid':
        if (data.apiKey) updateMap.sendgridApiKey = data.apiKey;
        if (data.fromEmail) updateMap.sendgridFromEmail = data.fromEmail;
        if (data.replyToEmail !== undefined) updateMap.sendgridReplyToEmail = data.replyToEmail || null;
        resetSendGridState();
        break;

      case 'slack':
        if (data.webhookUrl !== undefined) updateMap.slackWebhookUrl = data.webhookUrl || null;
        break;

      case 'security':
        if (data.password) updateMap.adminPasswordHash = await hashPassword(data.password);
        if (data.cronSecret) updateMap.cronSecret = data.cronSecret;
        break;

      case 'branding':
        if (data.companyName !== undefined) updateMap.companyName = data.companyName;
        if (data.primaryColor) updateMap.primaryColor = data.primaryColor;
        if (data.logoUrl !== undefined) updateMap.logoUrl = data.logoUrl || null;
        if (data.portfolioUrl !== undefined) updateMap.portfolioUrl = data.portfolioUrl || null;
        if (data.caseStudyUrl !== undefined) updateMap.caseStudyUrl = data.caseStudyUrl || null;
        if (data.bookingUrl !== undefined) updateMap.bookingUrl = data.bookingUrl || null;
        break;

      default:
        return NextResponse.json(
          { error: `Unknown section: ${section}` },
          { status: 400 }
        );
    }

    await updateSettings(updateMap as any);
    const updated = await getMaskedSettings();

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    const { message, code, status } = getErrorResponse(error);
    return NextResponse.json({ error: message, code }, { status });
  }
}

/**
 * POST /api/sms-automation/settings
 * Test connections for integrations.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminAuth(request);
    if (!auth.authorized) return auth.response!;

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'test-twilio': {
        const { sendSMS } = await import('../../integrations/twilio');
        const settings = await getDecryptedSettings();
        if (!settings.twilioPhoneNumber) {
          return NextResponse.json({ error: 'Twilio phone number not configured' }, { status: 400 });
        }
        // Send a test SMS to the Twilio phone number itself
        await sendSMS({ to: settings.twilioPhoneNumber, body: 'SMS Automation Widget: Test message successful!' });
        return NextResponse.json({ success: true, message: 'Test SMS sent successfully' });
      }

      case 'test-sendgrid': {
        const { sendEmail } = await import('../../integrations/sendgrid');
        const settings = await getDecryptedSettings();
        if (!settings.sendgridFromEmail) {
          return NextResponse.json({ error: 'SendGrid from email not configured' }, { status: 400 });
        }
        await sendEmail({
          to: settings.sendgridFromEmail,
          subject: 'SMS Automation Widget: Test Email',
          html: '<p>This is a test email from the SMS Automation Widget. Configuration is working!</p>',
        });
        return NextResponse.json({ success: true, message: 'Test email sent successfully' });
      }

      case 'test-slack': {
        const { notifySlack } = await import('../../integrations/slack');
        const result = await notifySlack({
          text: 'SMS Automation Widget: Test notification successful!',
        });
        if (!result) {
          return NextResponse.json({ error: 'Slack webhook not configured or failed' }, { status: 400 });
        }
        return NextResponse.json({ success: true, message: 'Test Slack notification sent' });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error) {
    const { message, code, status } = getErrorResponse(error);
    return NextResponse.json({ error: message, code }, { status });
  }
}
