import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to handle authentication for the API.
 * It checks for an 'Authorization' header with a 'Bearer' token, validates the token,
 * and attaches the user ID to the request object.
 * In a real application, the token would be a JWT that is decoded and verified.
 * @param req The request object.
 * @param res The response object.
 * @param next The next middleware function.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get the authorization header.
  const authHeader = req.headers.authorization;

  // If the authorization header is missing or doesn't start with 'Bearer ', return a 401 error.
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Get the token from the header.
  const token = authHeader.split(' ')[1];

  // For this simplified example, we're just checking if the token is 'test-user'.
  // In a real application, you would decode and verify a JWT here.
  if (token !== 'test-user') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // In a real app, you'd decode the token and attach the user to the request
  (req as any).user = { id: token };

  // Call the next middleware function.
  next();
};
