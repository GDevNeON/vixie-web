/**
 * The migrated cinematic preview runs in sample mode on the static site.
 * Its original local preview server still owns optional AI status/chat calls.
 */
export const prerender = true;

export function GET(): Response {
  return new Response(JSON.stringify({ live: false, model: 'openrouter/free' }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
