export const dynamic = 'force-dynamic';

export function GET(): Response {
  return Response.json(
    {
      ok: true,
      service: 'dadgar-site',
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'cache-control': 'no-store',
      },
    },
  );
}
