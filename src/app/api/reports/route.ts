import { NextRequest } from 'next/server';
import { getReport } from './logic';

export async function GET(req: NextRequest) {
  return getReport(req);
}