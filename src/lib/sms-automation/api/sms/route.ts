import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../db';
import { smsMessages, leads } from '../../db/schema';
import { sendSMS } from '../../integrations/twilio';
import { sendSmsSchema } from '../../lib/validation';
import { notifySlack, formatSMSResponse } from '../../integrations/slack';
import { getErrorResponse } from '../../utils/errors';
import { getSMSSegmentCount } from '../../lib/templates';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

/**
 * GET /api/sms-automation/sms
 * Get SMS conversation history for a lead or phone
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');
    const phone = searchParams.get('phone');

    if (!leadId && !phone) {
      return NextResponse.json(
        { error: 'Either leadId or phone is required' },
        { status: 400 }
      );
    }

    const whereClause = leadId
      ? eq(smsMessages.leadId, leadId)
      : eq(smsMessages.phone, phone!);

    const messages = await db
      .select()
      .from(smsMessages)
      .where(whereClause)
      .orderBy(desc(smsMessages.createdAt));

    return NextResponse.json({
      messages,
      leadId,
      phone: phone || messages[0]?.phone,
    });
  } catch (error) {
    const { message, code, status } = getErrorResponse(error);
    return NextResponse.json({ error: message, code }, { status });
  }
}

/**
 * POST /api/sms-automation/sms
 * Send an SMS message
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = sendSmsSchema.parse(body);

    const segments = getSMSSegmentCount(validated.body);

    // Send via Twilio
    const result = await sendSMS({ to: validated.phone, body: validated.body });

    // Store message
    const [message] = await db
      .insert(smsMessages)
      .values({
        leadId: validated.leadId || null,
        phone: validated.phone,
        direction: 'outbound',
        body: validated.body,
        twilioSid: result.sid,
        status: 'sent',
      })
      .returning();

    // Notify Slack if we have a lead
    if (validated.leadId) {
      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, validated.leadId));

      if (lead) {
        await notifySlack(
          formatSMSResponse(validated.phone, validated.body, {
            leadName: lead.name,
            leadId: validated.leadId,
          })
        );
      }
    }

    return NextResponse.json({ message, segments }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    const { message, code, status } = getErrorResponse(error);
    return NextResponse.json({ error: message, code }, { status });
  }
}
