/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [{ hostname: 'cdn.sanity.io' }, { hostname: 'cdn.vidyard.com' }],
    dangerouslyAllowSVG: true,
  },
  env: {
    PUBLIC_URL: '/',
  },
  i18n: {
    localeDetection:false,
    locales: ['en','en-AU','en-GB'],
    defaultLocale: 'en'

  },

  assetPrefix: "/en-AU",

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
