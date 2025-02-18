import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);
const publicRoutes = ['/test', '/test1'];  // Array of unprotected routes

export default clerkMiddleware(async (auth, request) => {
  // Check if the request URL is in the publicRoutes array
  if (!isPublicRoute(request) && !publicRoutes.some(route => request.url?.includes(route))) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
