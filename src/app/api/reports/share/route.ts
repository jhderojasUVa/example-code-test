import { NextRequest } from 'next/server';
import { shareReport } from './logic';

export async function POST(req: NextRequest) {
  return shareReport(req);
}