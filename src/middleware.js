// Wrapper: accept-md runs first, then your middleware
import { NextResponse } from 'next/server';

const MARKDOWN_ACCEPT = /\btext\/markdown\b/;
const EXCLUDED_PREFIXES = ['/api/', '/_next/'];

async function markdownMiddleware(request) {
  const pathname = request.nextUrl.pathname;
  const accept = request.headers.get('accept') || '';
  if (!MARKDOWN_ACCEPT.test(accept)) return null;
  if (EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))) return null;
  const url = request.nextUrl.clone();
  url.pathname = '/api/accept-md';
  url.searchParams.set('path', pathname);
  return NextResponse.rewrite(url);
}

export async function middleware(request) {
  const markdownRes = await markdownMiddleware(request);
  if (markdownRes) return markdownRes;
  const mod = await import('./middleware.user.js');
  const userMiddleware = mod.default ?? mod.middleware;
  return userMiddleware(request);
}
