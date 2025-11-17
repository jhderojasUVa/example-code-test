import { NextRequest, NextResponse } from 'next/server';
import { sharedTokens, evidence } from '@/lib/db';

export async function getSharedReport(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;

  const sharedToken = sharedTokens.find((t) => t.token === token);

  if (!sharedToken || sharedToken.used || sharedToken.expires_at < Date.now()) {
    return new NextResponse('Invalid or expired token', { status: 404 });
  }

  sharedToken.used = true;

  const userEvidence = evidence.filter(
    (e) => e.user_id === sharedToken.user_id
  );

  const report = {
    user_id: sharedToken.user_id,
    generated_at: new Date().toISOString(),
    evidence: userEvidence,
  };

  return new NextResponse(JSON.stringify(report), { status: 200 });
}
