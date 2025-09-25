import { NextResponse } from 'next/server';
import { geolocation } from '@vercel/functions';

export async function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  const geo = geolocation(request);

  // Default values for geo
  const country = geo?.country || 'US';
  console.log(geo, "geo");
  const city = geo?.city || 'San Francisco';
  const userRregion = geo?.region || 'CA';

  const countryVersion = (country === "UM" || country === "US") ? 1 : (country === "UK" || country === "GB") ? 2 : (country === "AU" || country === "NZ") ? 3 : 4;
  // const countryLocale = (countryVersion === 1) ? "en" : (countryVersion === 2) ? "en-GB" : (countryVersion === 3) ? "en-AU" : undefined;
  const countryLocale = undefined;


  

  const response = NextResponse.next();

  // Set cookies
  if (countryLocale && !request.cookies.get('__vs_pl')) {

    
    response.cookies.set('__vs_pl', countryLocale, { path: "/" });
  }
  response.cookies.set('__vs_ver', countryVersion, { path: "/", maxAge: 60 * 60 * 24 * 365 });

  return response;
}

export const config = {
  matcher: ['/', '/en-GB', '/en', '/en-AU', '/api/:path*'],
};
