import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import { sharedTokens } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function shareReport(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const token = uuidv4();
  const expires_at = Date.now() + 5 * 60 * 1000; // 5 minutes

  sharedTokens.push({
    token,
    user_id: userId,
    expires_at,
    used: false,
  });

  const share_url = `${req.nextUrl.origin}/api/share/${token}`;

  return new NextResponse(JSON.stringify({ share_url }), { status: 200 });
}
