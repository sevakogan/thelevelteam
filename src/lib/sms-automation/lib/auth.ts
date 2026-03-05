import { NextRequest, NextResponse } from 'next/server';
import { getDecryptedSettings } from './settings';
import { verifyPassword } from './crypto';

/**
 * Verify admin authentication for protected routes.
 * If no admin password is configured (setup mode), access is granted.
 */
export async function verifyAdminAuth(
  request: NextRequest
): Promise<{ authorized: boolean; response?: NextResponse }> {
  const settings = await getDecryptedSettings();
  const passwordHash = settings.adminPasswordHash;

  // If no password set yet, allow access (setup mode)
  if (!passwordHash) {
    return { authorized: true };
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Authorization required. Provide Bearer token.' },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.substring(7);
  const isValid = await verifyPassword(token, passwordHash);

  if (!isValid) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      ),
    };
  }

  return { authorized: true };
}

/**
 * Verify cron secret for protected cron endpoints.
 */
export async function verifyCronAuth(
  request: NextRequest
): Promise<{ authorized: boolean; response?: NextResponse }> {
  const settings = await getDecryptedSettings();
  const cronSecret = settings.cronSecret;

  if (!cronSecret) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Cron secret not configured. Set it in Settings.' },
        { status: 500 }
      ),
    };
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.substring(7);
  if (token !== cronSecret) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      ),
    };
  }

  return { authorized: true };
}
