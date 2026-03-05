import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../db';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  updateLeadStatus,
} from '../../lib/leads';
import { enrollLeadInCampaigns } from '../../lib/drip';
import { leadFormSchema, updateLeadSchema } from '../../lib/validation';
import { notifySlack, formatNewLeadSlack } from '../../integrations/slack';
import { getErrorResponse } from '../../utils/errors';
import { z } from 'zod';

/**
 * GET /api/sms-automation/leads
 * Retrieve leads with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!)
      : 50;
    const offset = searchParams.get('offset')
      ? parseInt(searchParams.get('offset')!)
      : 0;

    if (id) {
      const lead = await getLeadById(id);
      if (!lead) {
        return NextResponse.json(
          { error: 'Lead not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(lead);
    }

    const leads = await getLeads({ status: status ?? undefined, limit, offset });
    return NextResponse.json(leads);
  } catch (error) {
    const { message, code, status } = getErrorResponse(error);
    return NextResponse.json({ error: message, code }, { status });
  }
}

/**
 * POST /api/sms-automation/leads
 * Create a new lead
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate
    const validated = leadFormSchema.parse(body);

    // Create lead
    const lead = await createLead(validated);

    // Enroll in campaigns
    await enrollLeadInCampaigns(lead);

    // Notify Slack
    await notifySlack(formatNewLeadSlack(lead));

    return NextResponse.json(lead, { status: 201 });
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

/**
 * PUT /api/sms-automation/leads
 * Update a lead
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate
    const validated = updateLeadSchema.parse(body);

    // Update lead
    const lead = await updateLead(id, validated);

    return NextResponse.json(lead);
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

/**
 * DELETE /api/sms-automation/leads
 * Delete a lead
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    await deleteLead(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    const { message, code, status } = getErrorResponse(error);
    return NextResponse.json({ error: message, code }, { status });
  }
}
