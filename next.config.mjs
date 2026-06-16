import path from "path";
import { fileURLToPath } from "url";

import {
  resourcesTurbopackAliases,
  resourcesWebpackAliases,
} from './resources/integration/aliases.mjs'
import { resourceRedirects } from './resources/integration/redirects.mjs'
import {
  resourceRewritesBeforeFiles,
} from './resources/integration/rewrites.mjs'

/** @type {import('next').NextConfig} */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const config = {
  compiler: {
    removeConsole: process.env.NODE_ENV == 'production',
  },
  turbopack:{
    root: path.resolve(__dirname),
    resolveAlias: {
      ...resourcesTurbopackAliases,
    },
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
    locales: ['en','en-AU', 'en-GB'],
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
      ...resourcesWebpackAliases,
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
        source: '/en/dental-phones/:path*',
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
        source: '/en/dental-phones/ai-receptionist',
        destination: '/phone-system/features/ai-receptionist',
        permanent: false,
      },
      {
        source: '/en-GB/dental-phones/features/ai-receptionist',
        destination: '/en-GB/dental-phones/features',
        permanent: false,
        locale: false,
      },
      {
        source: '/en-GB/dental-phones/features/two-way-texting',
        destination: '/en-GB/dental-phones/features',
        permanent: false,
        locale: false,
      },
      ...resourceRedirects,
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
    return {
      beforeFiles: [
        ...resourceRewritesBeforeFiles,
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
      ],
    }
  },
  
}

export default config
