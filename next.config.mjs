
import path from "path";
import { fileURLToPath } from "url";

/** @type {import('next').NextConfig} */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const config = {
  turbopack:{
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { hostname: 'cdn.sanity.io' }, 
      { hostname: 'cdn.vidyard.com' },
      { hostname: 'www.figma.com' }
    ],
    dangerouslyAllowSVG: true,
  },
  env: {
    PUBLIC_URL: '/',
  },
  i18n: {
    localeDetection:false,
    locales: ['en', 'en-GB','en-AU'],
    defaultLocale: 'en'
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
        source: '/demo',
        destination: 'https://share.hsforms.com/1Ki7rdqhxR4S3koEnfmCMQA2vkpl',
        permanent: false,
        has: [
          {
            type: 'query',
            key: 'region',
            value: 'en-AU',
          },
        ],
      },
      
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
        destination: '/en-GB',
        locale: false,
      },
      {
        source: '/en-gb/:path*',
        destination: '/en-GB/:path*',
        locale: false,
      },
      {
        source: '/en-au',
        destination: '/en-AU',
        locale: false,
      },
      {
        source: '/en-au/:path*',
        destination: '/en-AU/:path*',
        locale: false,
      },
    ];
  },
  
}

export default config
