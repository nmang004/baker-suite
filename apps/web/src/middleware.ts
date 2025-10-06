import { authMiddleware } from '@clerk/nextjs';

// Public routes accessible without authentication
export default authMiddleware({
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/calculator(.*)', // Calculator is free for everyone!
    '/api/webhooks(.*)',
  ],
  ignoredRoutes: ['/api/webhooks(.*)'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
