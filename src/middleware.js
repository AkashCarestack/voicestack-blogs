// Wrapper: accept-md runs first, then your middleware
import { NextResponse } from 'next/server';

const MARKDOWN_ACCEPT = new RegExp('\\btext/markdown\\b', 'i');
const EXCLUDED_PREFIXES = ['/api/', '/_next/', '/studio'];

/** @param {import('next/server').NextRequest} request */
async function markdownMiddleware(request) {
  const pathname = request.nextUrl.pathname;
  const accept = (request.headers.get('accept') || '').toLowerCase();
  if (!MARKDOWN_ACCEPT.test(accept)) return null;
  if (EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))) return null;
  const url = request.nextUrl.clone();
  url.pathname = '/api/accept-md';
  url.searchParams.set('path', pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-accept-md-path', pathname);
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

/** @param {import('next/server').NextRequest} request */
export async function middleware(request) {
  const markdownRes = await markdownMiddleware(request);
  if (markdownRes) return markdownRes;
  const mod = await import('./middleware.user');
  // Support both named export and default export
  const userMiddleware = mod.middleware ?? mod['default'];
  if (!userMiddleware) {
    throw new Error('middleware.user must export either a named "middleware" function or a default export');
  }
  return userMiddleware(request);
}
