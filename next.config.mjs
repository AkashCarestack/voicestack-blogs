
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
      { hostname: 'www.figma.com' },
      { hostname: 'img.youtube.com' },
      { hostname: 'a.storyblok.com' }
    ],
    dangerouslyAllowSVG: true,
  },
  env: {
    PUBLIC_URL: '/',
  },
  i18n: {
    localeDetection:false,
    locales: ['en'],
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
      
    ]
  },

  async rewrites() {
   
    return [
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
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      
      // {
      //   source: '/en-gb',
      //   destination: '/en-GB',
      //   locale: false,
      // },
      {
        source: '/en-gb/:path*',
        destination: '/en-GB/:path*',
        locale: false,
      },
      {
        source: '/en-au',
        destination: 'https://voicestack-sanity-hkz4.vercel.app/en-AU',
        
      },
      {
        source: '/en-AU',
        destination: 'https://voicestack-sanity-hkz4.vercel.app/en-AU',
      
      },
      {
        source: '/en-au/:path',
        destination: 'https://voicestack-sanity-hkz4.vercel.app/en-AU/:path',
      
      },
      {
        source: '/en-AU/:path*',
        destination: 'https://voicestack-sanity-hkz4.vercel.app/en-AU/:path*',
       
      }
    ];
  },
  
}

export default config
