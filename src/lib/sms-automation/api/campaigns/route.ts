import { NextRequest, NextResponse } from 'next/server';
import {
  createDripCampaign,
  getAllDripCampaigns,
  getCampaignById,
  updateDripCampaign,
  toggleCampaignActive,
} from '../../lib/drip';
import { campaignSchema } from '../../lib/validation';
import { getErrorResponse } from '../../utils/errors';
import { z } from 'zod';

/**
 * GET /api/sms-automation/campaigns
 * Get all drip campaigns
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const campaign = await getCampaignById(id);
      if (!campaign) {
        return NextResponse.json(
          { error: 'Campaign not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(campaign);
    }

    const campaigns = await getAllDripCampaigns();
    return NextResponse.json(campaigns);
  } catch (error) {
    const { message, code, status } = getErrorResponse(error);
    return NextResponse.json({ error: message, code }, { status });
  }
}

/**
 * POST /api/sms-automation/campaigns
 * Create a new campaign
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate
    const validated = campaignSchema.parse(body);

    // Create campaign
    const campaign = await createDripCampaign({
      name: validated.name,
      channel: validated.channel,
      messages: validated.messages,
      smsMessages: validated.messages.filter((m) => m.type === 'sms'),
      emailMessages: validated.messages.filter((m) => m.type === 'email'),
      isActive: validated.isActive,
    });

    return NextResponse.json(campaign, { status: 201 });
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
 * PUT /api/sms-automation/campaigns
 * Update a campaign
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate
    const validated = campaignSchema.parse(body);

    // Update campaign
    const campaign = await updateDripCampaign(id, {
      name: validated.name,
      channel: validated.channel,
      messages: validated.messages,
      smsMessages: validated.messages.filter((m) => m.type === 'sms'),
      emailMessages: validated.messages.filter((m) => m.type === 'email'),
      isActive: validated.isActive,
    });

    return NextResponse.json(campaign);
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
 * PATCH /api/sms-automation/campaigns
 * Toggle campaign active status
 */
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    const campaign = await toggleCampaignActive(id);
    return NextResponse.json(campaign);
  } catch (error) {
    const { message, code, status } = getErrorResponse(error);
    return NextResponse.json({ error: message, code }, { status });
  }
}

/**
 * DELETE /api/sms-automation/campaigns
 * Delete a campaign
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    // TODO: Implement delete campaign logic
    // For now, just toggle inactive
    await toggleCampaignActive(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    const { message, code, status } = getErrorResponse(error);
    return NextResponse.json({ error: message, code }, { status });
  }
}
