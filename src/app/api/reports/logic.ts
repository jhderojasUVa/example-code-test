import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import { evidence } from '@/lib/db';

export async function getReport(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const userEvidence = evidence.filter((e) => e.user_id === userId);

  const report = {
    user_id: userId,
    generated_at: new Date().toISOString(),
    evidence: userEvidence,
  };

  return new NextResponse(JSON.stringify(report), { status: 200 });
}
