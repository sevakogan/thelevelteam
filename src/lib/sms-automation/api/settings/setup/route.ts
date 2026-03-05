import { NextRequest, NextResponse } from 'next/server';
import { isSetupComplete, updateSettings } from '../../../lib/settings';
import { hashPassword } from '../../../lib/crypto';
import { getErrorResponse } from '../../../utils/errors';

/**
 * GET /api/sms-automation/settings/setup
 * Check if initial setup has been completed.
 */
export async function GET() {
  try {
    const setupCompleted = await isSetupComplete();
    return NextResponse.json({ setupCompleted });
  } catch (error) {
    const { message, code, status } = getErrorResponse(error);
    return NextResponse.json({ error: message, code }, { status });
  }
}

/**
 * POST /api/sms-automation/settings/setup
 * Complete initial setup (set admin password and mark setup as started).
 */
export async function POST(request: NextRequest) {
  try {
    const setupCompleted = await isSetupComplete();
    if (setupCompleted) {
      return NextResponse.json(
        { error: 'Setup has already been completed. Use the settings API to make changes.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    await updateSettings({
      adminPasswordHash: passwordHash,
      setupCompleted: true,
    } as any);

    return NextResponse.json({
      success: true,
      message: 'Setup completed. Use this password as your Bearer token for API access.',
    });
  } catch (error) {
    const { message, code, status } = getErrorResponse(error);
    return NextResponse.json({ error: message, code }, { status });
  }
}
