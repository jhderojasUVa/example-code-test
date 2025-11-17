import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  if (token !== 'test-user') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // In a real app, you'd decode the token and attach the user to the request
  (req as any).user = { id: token };

  next();
};
