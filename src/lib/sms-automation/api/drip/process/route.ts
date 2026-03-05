import { NextRequest, NextResponse } from 'next/server';
import { processNextDripMessages } from '../../../lib/drip';
import { verifyCronAuth } from '../../../lib/auth';
import { getErrorResponse } from '../../../utils/errors';

/**
 * POST /api/sms-automation/drip/process
 * Process pending drip messages. Requires Bearer token (cron secret from Settings).
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyCronAuth(request);
    if (!auth.authorized) return auth.response!;

    const result = await processNextDripMessages();

    return NextResponse.json({
      success: true,
      processed: result.processed,
      errors: result.errors,
      message: `Processed ${result.processed} drip messages${
        result.errors.length > 0 ? ` with ${result.errors.length} errors` : ''
      }`,
    });
  } catch (error) {
    const { message, code, status } = getErrorResponse(error);
    return NextResponse.json({ error: message, code }, { status });
  }
}

/**
 * GET /api/sms-automation/drip/process
 * Health check endpoint.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Drip processor is running. Use POST with Bearer token to trigger processing.',
  });
}
