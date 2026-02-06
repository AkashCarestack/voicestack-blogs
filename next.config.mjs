
import path from "path";
import { fileURLToPath } from "url";

/** @type {import('next').NextConfig} */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const config = {
  compiler: {
    removeConsole: process.env.NODE_ENV == 'production',
  },
  turbopack:{
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { hostname: 'cdn.sanity.io' }, 
      { hostname: 'cdn.vidyard.com' },
      { hostname: 'www.figma.com' },
      { hostname: 'img.youtube.com' },
      { hostname: 'a.storyblok.com' },
      { hostname: 'i.ytimg.com' }
    ],
    dangerouslyAllowSVG: true,
  },
  env: {
    PUBLIC_URL: '/',
  },
  i18n: {
    localeDetection:false,
    locales: ['en','en-AU' ],
    defaultLocale: 'en'
  },
  // Fix for Vercel deployment issues
  experimental: {
    // Disable experimental features that might cause issues
  },
  // Increase memory limits
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.optimization.splitChunks = false;
    }
    // Add alias resolution for ~/assets
    config.resolve.alias = {
      ...config.resolve.alias,
      '~/assets': path.resolve(__dirname, 'public/assets'),
    };
    return config;
  },
  // Disable static optimization for problematic pages
  trailingSlash: false,
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },

  async redirects() {
   
    return [
      
      {
        source: '/legal/privacy-policy',
        destination: '/legal/2025-01/privacy-policy',
        permanent: false,
      },
      {
        source: '/legal/uk/privacy-policy',
        destination: '/legal/uk/2024-11/privacy-policy',
        permanent: false,
      },
      {
        source: '/legal/au/privacy-policy',
        destination: '/legal/aus/2024-11/privacy-policy',
        permanent: false,
      },
      {
        source: '/fmc',
        destination: '/en-GB?lead_source=FMC&utm_medium=print',
        permanent: false,
      },
      {
        source: '/fmc2',
        destination: '/en-GB?lead_source=FMC&utm_medium=digital',
        permanent: false,
      },
      {
        source: '/dental-phones/:path*',
        destination: '/phone-system',
        permanent: false,
      },
      {
        source: '/en/dental-phones',
        destination: '/phone-system',
        permanent: false,
        locale: false,
      },
      {
        source: '/en/who-we-serve/groups-and-dsos',
        destination: '/who-we-serve/groups-and-enterprises',
        permanent: false,
        locale: false,
      },
      {
        source: '/en/who-we-serve/single-locations',
        destination: '/who-we-serve/dental',
        permanent: false,
        locale: false,
      },
      {
        source: '/en/who-we-serve/startups',
        destination: '/who-we-serve/dental',
        permanent: false,
        locale: false,
        // Only applies to default locale (en) - locale-aware by default in Next.js i18n
      },
      {
        source: '/en/who-we-serve/mobile-practice',
        destination: '/who-we-serve/dental',
        permanent: false,
        locale: false,
      },
      {
        source: '/en/who-we-serve/specialists',
        destination: '/who-we-serve/dental',
        permanent: false,
        locale: false, // Only apply to default locale (en), not en-AU
      },
      {
        source: '/dental-phones/ai-receptionist',
        destination: '/phone-system/features/ai-receptionist',
        permanent: false,
      },
      {
        source: '/',
        has: [
          { type: 'query', key: 's' }
        ],
        destination: '/search',
        permanent: false,
      }
    ]
  },

  async rewrites() {
   
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/en-gb',
        destination: 'https://voicestack-engb.vercel.app/en-GB',
      },
      {
        source: '/en-gb/:path*',
        destination:'https://voicestack-engb.vercel.app/en-GB/:path*',
      },
      {
        source: '/en-GB',
        destination: 'https://voicestack-engb.vercel.app/en-GB',
      },
      {
        source: '/en-GB/:path*',
        destination:'https://voicestack-engb.vercel.app/en-GB/:path*',
      },
      
      {
        source: '/en-gb',
        destination: '/en-GB',
        locale: false,
      },
      {
        source: '/en-gb/:path*',
        destination: '/en-GB/:path*',
        locale: false,
      },
      {
        source: '/en-au/:path*',
        destination: '/en-AU/:path*',
        locale: false,
      },
      // {
      //   source: '/en-au',
      //   destination: 'https://voicestack-sanity-hkz4.vercel.app/en-AU',
        
      // },
      // {
      //   source: '/en-AU',
      //   destination: 'https://voicestack-sanity-hkz4.vercel.app/en-AU',
      
      // },
      // {
      //   source: '/en-au/:path',
      //   destination: 'https://voicestack-sanity-hkz4.vercel.app/en-AU/:path',
      
      // },
      // {
      //   source: '/en-AU/:path*',
      //   destination: 'https://voicestack-sanity-hkz4.vercel.app/en-AU/:path*',
       
      // }
    ];
  },
  
}

export default config
