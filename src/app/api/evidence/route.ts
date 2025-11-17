import { NextRequest } from 'next/server';
import { createEvidence, getEvidence } from './logic';

export async function POST(req: NextRequest) {
  return createEvidence(req);
}

export async function GET(req: NextRequest) {
  return getEvidence(req);
}