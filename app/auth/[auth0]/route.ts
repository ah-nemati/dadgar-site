import { auth0 } from '@/lib/auth0';

/**
 * Auth0's built-in routes are dispatched from a Route Handler instead of
 * Next.js middleware/proxy. This avoids the current Next.js 16 proxy issue
 * and also avoids Node.js middleware, which Cloudflare Workers does not
 * support yet.
 */
async function handleAuthRequest(request: Request): Promise<Response> {
  try {
    return await auth0.middleware(request);
  } catch (error) {
    console.error('[auth0-route]', {
      pathname: new URL(request.url).pathname,
      message: error instanceof Error ? error.message : String(error),
    });

    return Response.json(
      { error: 'AUTHENTICATION_REQUEST_FAILED' },
      {
        status: 500,
        headers: {
          'cache-control': 'no-store',
        },
      },
    );
  }
}

export const GET = handleAuthRequest;
export const POST = handleAuthRequest;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
