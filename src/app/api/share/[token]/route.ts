import { NextRequest } from 'next/server';
import { getSharedReport } from './logic';

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  return getSharedReport(req, { params });
}