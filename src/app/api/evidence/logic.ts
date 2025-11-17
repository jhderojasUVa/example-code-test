// Import necessary modules from Next.js server, authentication library, database, and uuid for generating unique IDs.
import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import { evidence, Evidence } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

/**
 * Handles the creation of a new evidence record.
 * @param req - The incoming Next.js request object.
 * @returns A Next.js response object.
 */
export async function createEvidence(req: NextRequest) {
  // Retrieve the user ID from the request using an authentication utility.
  const userId = getUserId(req);
  // If no user ID is found, return an "Unauthorized" response.
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Parse the JSON body of the request to get evidence details.
  const body = await req.json();
  const { title, media_type, file } = body;

  // Check for the presence of required fields: title, media_type, and file.
  if (!title || !media_type || !file) {
    return new NextResponse('Missing required fields', { status: 400 });
  }

  // Define the allowed media types for the evidence.
  const allowedMediaTypes = ['video', 'image', 'voice_note', 'text'];
  // Validate that the provided media_type is one of the allowed types.
  if (!allowedMediaTypes.includes(media_type)) {
    return new NextResponse('Invalid media type', { status: 400 });
  }

  // Create a new evidence object with a unique ID, user ID, and other details.
  const newEvidence: Evidence = {
    id: uuidv4(), // Generate a new unique identifier.
    user_id: userId,
    title,
    media_type,
    file,
    secure_reference: `evidence/${userId}/${uuidv4()}`, // Create a secure reference path.
    created_at: new Date().toISOString(), // Set the creation timestamp.
  };

  // Add the new evidence record to the in-memory database.
  evidence.push(newEvidence);

  // Return the newly created evidence object with a 201 "Created" status.
  return new NextResponse(JSON.stringify(newEvidence), { status: 201 });
}

/**
 * Retrieves all evidence records for the authenticated user.
 * @param req - The incoming Next.js request object.
 * @returns A Next.js response object.
 */
export async function getEvidence(req: NextRequest) {
  // Retrieve the user ID from the request.
  const userId = getUserId(req);
  // If no user ID is found, return an "Unauthorized" response.
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Filter the evidence records to get those belonging to the user.
  const userEvidence = evidence
    .filter((e) => e.user_id === userId)
    // Sort the evidence by creation date in descending order.
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Return the user's evidence records with a 200 "OK" status.
  return new NextResponse(JSON.stringify(userEvidence), { status: 200 });
}
