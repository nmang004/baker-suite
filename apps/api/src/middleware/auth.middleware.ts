import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Express Request type to include auth
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        sessionId?: string;
        claims?: Record<string, unknown>;
      };
    }
  }
}

/**
 * Clerk authentication middleware
 * Validates JWT tokens and attaches auth info to request
 *
 * NOTE: In production, this should use @clerk/express ClerkExpressRequireAuth
 * For now, this is a simplified version for development
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'No authentication token provided',
      },
    });
    return;
  }

  // Extract token
  const token = authHeader.substring(7);

  // TODO: Validate token with Clerk
  // For development, we'll extract userId from a simple token
  // In production, use: ClerkExpressRequireAuth() from @clerk/express

  try {
    // Temporary: For development, allow any non-empty token
    // Extract userId from token or use a default for development
    if (!token) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid token',
        },
      });
      return;
    }

    // In development, ensure a test user exists
    // In production, Clerk will handle user creation via webhooks
    const clerkId = token; // Use token as Clerk ID for now

    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      // Create a test user for development
      user = await prisma.user.create({
        data: {
          clerkId,
          email: `${clerkId}@test.com`,
          firstName: 'Test',
          lastName: 'User',
        },
      });
    }

    // Mock auth object for development
    // In production, Clerk middleware will populate this
    req.auth = {
      userId: user.id, // Use the database user ID
      sessionId: 'dev-session',
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication failed',
      },
    });
    return;
  }
};

/**
 * Optional authentication middleware
 * Attaches auth if present, but doesn't require it
 */
export const optionalAuth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  try {
    const token = authHeader.substring(7);

    if (token) {
      const clerkId = token;

      let user = await prisma.user.findUnique({
        where: { clerkId },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            clerkId,
            email: `${clerkId}@test.com`,
            firstName: 'Test',
            lastName: 'User',
          },
        });
      }

      req.auth = {
        userId: user.id,
        sessionId: 'dev-session',
      };
    }

    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
};
