import enGb from '../../../public/assets/countryFlags/EN-GB.png'
import en from '../../../public/assets/countryFlags/EN-usa.png'
import enAu from '../../../public/assets/countryFlags/EN-AU.png'
import posthog from 'posthog-js'

export const fetchAuthor = (post) => {
  let authorData: any = []
  post &&
    post.authorInfo &&
    post.authorInfo.content &&
    post.authorInfo.content.body &&
    Array.isArray(post.authorInfo.content.body) &&
    post.authorInfo.content.body
      .filter((block: any) => block.component === 'authorBioSection')
      .map((author: any) => (authorData = author.author))
  return authorData
}

export function rgbToHsl(r, g, b) {
  ;(r /= 255), (g /= 255), (b /= 255)

  var max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  var h,
    s,
    l = (max + min) / 2

  if (max == min) {
    h = s = 0 // achromatic
  } else {
    var d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  // return [ h, 40, 40 ];

  return `hsl(${h * 360},50%,40%)`
  // return `hsl(${h*100},40%,40%)`
}

export const capitalizeFirstLetter = (string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1) + 's'
}

export const getUniqueReorderedCarouselItems = (
  homeSettings,
  ebooks,
  webinars,
) => {
  if (!homeSettings?.featuredCarouselItems || !ebooks || !webinars) return []
  const carouselItems = [
    ...homeSettings?.featuredCarouselItems,
    ...ebooks,
    ...webinars,
  ]

  const uniqueCarouselItems = carouselItems.reduce((acc, item) => {
    if (
      !acc.some(
        (existingItem) => existingItem.slug.current === item.slug.current,
      )
    ) {
      acc.push(item)
    }
    return acc
  }, [])

  return [
    ...(homeSettings?.featuredCarouselItems || []),
    ...uniqueCarouselItems.filter(
      (item) =>
        !(homeSettings?.featuredCarouselItems || []).some(
          (homeItem) => homeItem.slug.current === item.slug.current,
        ),
    ),
  ]
}

export const mergeReviews = (
  homeSettingsReviews = [],
  otherReviews = [],
  uniqueKey = '_id',
) => {
  const seen = new Set()
  const result = []
  if (homeSettingsReviews && homeSettingsReviews.length > 0) {
    result.push(...homeSettingsReviews)
    homeSettingsReviews.forEach((review) => seen.add(review[uniqueKey]))
  }
  if (otherReviews && Array.isArray(otherReviews)) {
    otherReviews.forEach((review) => {
      if (!seen.has(review[uniqueKey])) {
        seen.add(review[uniqueKey])
        result.push(review)
      }
    })
  }

  return result
}

export const mergeAndRemoveDuplicates = (
  primaryArray,
  secondaryArray = [],
  uniqueKey = '_id',
) => {
  if (!primaryArray || !secondaryArray) return []

  const seen = new Set()
  const result = []

  if (!Array.isArray(primaryArray)) {
    if (primaryArray[uniqueKey] && !seen.has(primaryArray[uniqueKey])) {
      seen.add(primaryArray[uniqueKey])
      result.push(primaryArray)
    }
  } else {
    if (primaryArray && Array.isArray(primaryArray)) {
      primaryArray.forEach((item) => {
        if (item && !seen.has(item[uniqueKey]) && result.length < 5) {
          seen.add(item[uniqueKey])
          result.push(item)
        }
      })
    }
  }

  if (secondaryArray && Array.isArray(secondaryArray)) {
    secondaryArray.forEach((item) => {
      if (item && !seen.has(item[uniqueKey]) && result.length < 5) {
        seen.add(item[uniqueKey])
        result.push(item)
      }
    })
  }

  return result
}

export const formatOrganizationSchemaDynamic = (props: any) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: `${props?.name}`,
    url: `${props?.url}`,
    logo: `${props?.logoUrl}`,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '',
        contactType: 'Customer Service',
        areaServed: `${props?.areaServed}`,
        availableLanguage: ['English'],
      },
    ],
    sameAs: `${props?.socialLinks}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Main Street',
      addressLocality: 'Orlando',
      addressRegion: 'FL',
      postalCode: '32801',
      addressCountry: 'US',
    },
    founder: {
      '@type': 'Person',
      name: `${props?.founder}`,
    },
    foundingDate: `${props?.foundingDate}`,
    numberOfEmployees: 50,
    description: `${props?.description}`,
    keywords: `${props?.keyWords}`,
  }
  return schema
}
export const formatSoftwareSchema = (props: any) => {

  const schema = 
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://voicestack.com/#software",
        "name": "VoiceStack",
        "alternateName": "VoiceStack AI-Powered Phone System",
        "url": "https://voicestack.com/",
        "mainEntityOfPage": "https://voicestack.com/",
        "image": [
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#primaryImage",
            "url": "https://voicestack.com/assets/schema/schema-logo-voicestack-1200x1200.jpg",
            "width": 1200,
            "height": 1200
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#brand1",
            "url": "https://voicestack.com/assets/schema/schema-logo-voicestack-1200x630.jpg",
            "width": 1200,
            "height": 630,
            "caption": "VoiceStack Logo"
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#brand2",
            "url": "https://voicestack.com/assets/schema/schema-icon-voicestack-purple-1200x1200.jpg",
            "width": 1200,
            "height": 1200,
            "caption": "VoiceStack Icon (Purple)"
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#brand3",
            "url": "https://voicestack.com/assets/schema/schema-icon-voicestack-black-1200x1200.jpg",
            "width": 1200,
            "height": 1200,
            "caption": "VoiceStack Icon (Black)"
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#brand4",
            "url": "https://voicestack.com/assets/schema/schema-icon-voicestack-white-1200x1200.jpg",
            "width": 1200,
            "height": 1200,
            "caption": "VoiceStack Icon (White)"
          }
        ],
        "applicationCategory": "BusinessApplication",
        "applicationSubCategory": "VoIP Software",
        "keywords": "dental voip, dental phones, dental phone system, dental ai phones, dentist voip, dentist phones, dentist phone system, dentist ai phones, veterinary voip, veterinary phones, veterinary phone system, veterinary ai phones, veterinarian voip, veterinarian phones, veterinarian phone system, veterinarian ai phones, optometry voip, optometry phones, optometry phone system, optometry ai phones, optometrist voip, optometrist phones, optometrist phone system, optometrist ai phones, physical therapy voip, physical therapy phones, physical therapy phone system, physical therapy ai phones, physical therapist voip, physical therapist phones, physical therapist phone system, physical therapist ai phones, ai receptionist, call analytics, two-way texting",
        "description": "VoiceStack® is an award-winning, AI-powered phone system that's trusted by thousands of dentists, veterinarians, optometrists, and physical therapists. Answer More Calls. Convert More Patients. Grow Your Practice Faster.",
        "publisher": {
          "@id": "https://voicestack.com/#organization"
        },
        "brand": {
          "@id": "https://voicestack.com/#organization"
        },
        "sameAs": [
          "https://www.facebook.com/voicestack/",
          "https://www.instagram.com/voicestack.ai/",
          "https://www.linkedin.com/company/voice-stack/",
          "https://www.youtube.com/@VoiceStack"
        ],
        "softwareVersion": "1.0",
        "releaseNotes": "VoiceStack's AI powered phone system caters to every requirement of modern dental, optometry, veterinary, and physical therapy practices. VoiceStack's features including missed call analysis, missed opportunity tracking, automated tasks and staff performance dashboards enable practices to improve their patient growth and increase practice revenue.",
        "applicationSuite": "VoiceStack Communications Platform",
        "operatingSystem": [
          "Windows 10 or later",
          "macOS 11 Big Sur or later",
          "Web browser latest versions"
        ],
        "softwareRequirements": "Operating System: Windows 10 or later, macOS 11 Big Sur or later, Web browser latest versions; CPU: Minimum Intel i5 / AMD Ryzen 5 or equivalent, Quad-core recommended; RAM: Minimum 8GB, recommended 16GB; Storage: At least 500MB free disk space; Internet: Minimum 10 Mbps, Static IP recommended, Network latency below 50ms; Ethernet: CAT5 or higher, PoE optional",
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Operating System",
            "value": "Windows 10 or later, macOS 11 Big Sur or later, Web browser latest versions"
          },
          {
            "@type": "PropertyValue",
            "name": "CPU",
            "value": "Minimum Intel i5 / AMD Ryzen 5 or equivalent, Quad-core recommended"
          },
          {
            "@type": "PropertyValue",
            "name": "RAM",
            "value": "Minimum 8GB, recommended 16GB"
          },
          {
            "@type": "PropertyValue",
            "name": "Storage",
            "value": "At least 500MB free disk space"
          },
          {
            "@type": "PropertyValue",
            "name": "Internet",
            "value": "Minimum 10 Mbps, Static IP recommended, Network latency below 50ms"
          },
          {
            "@type": "PropertyValue",
            "name": "Ethernet",
            "value": "CAT5 or higher, PoE optional"
          }
        ],
        "featureList": [
          "IVR & Call Routing",
          "Visual Voicemail",
          "Missed Call Response Tracking",
          "Call Flow Analytics",
          "Two-Way Texting",
          "Cloud Fax",
          "Call Flow Management",
          "Custom Phone Trees",
          "After-Hours Call Transfers",
          "Monitoring & Reporting",
          "Time Zone Management",
          "AI Receptionist",
          "AI Call Transcripts",
          "AI Call Scoring",
          "Missed Call Automations",
          "Opportunity Detection",
          "Opportunity Tracking",
          "Post-Call Task Detection",
          "Call Source Tracking",
          "Dynamic Number Insertion",
          "Campaign & Keyword Tracking",
          "Marketing Spend Optimization",
          "Google Analytics Integration",
          "Google Ads Integration"
        ],
        "softwareHelp": "https://voicestack.com/support",
        "screenshot": [
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#screenshot1",
            "url": "https://voicestack.com/assets/schema/schema-screenshot-voicestack-01.jpg",
            "width": 1200,
            "height": 630,
            "caption": "The AI Receptionist works 24/7, reduces missed opportunities, boosts conversions, and improves operational efficiency across your practice."
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#screenshot2",
            "url": "https://voicestack.com/assets/schema/schema-screenshot-voicestack-02.jpg",
            "width": 1200,
            "height": 630,
            "caption": "Answer more phone Calls at your front desk or call center to drive growth."
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#screenshot3",
            "url": "https://voicestack.com/assets/schema/schema-screenshot-voicestack-03.jpg",
            "width": 1200,
            "height": 630,
            "caption": "Identify, Re-Engage and Convert Missed Opportunities in Real-Time."
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#screenshot4",
            "url": "https://voicestack.com/assets/schema/schema-screenshot-voicestack-04.jpg",
            "width": 1200,
            "height": 630,
            "caption": "Automated Tasks for Staff Members to Keep Track of Every Opportunity."
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#screenshot5",
            "url": "https://voicestack.com/assets/schema/schema-screenshot-voicestack-05.jpg",
            "width": 1200,
            "height": 630,
            "caption": "Track, Analyze and Improve the Performance of Every Team Member."
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#screenshot6",
            "url": "https://voicestack.com/assets/schema/schema-screenshot-voicestack-06.jpg",
            "width": 1200,
            "height": 630,
            "caption": "Effortlessly Automating Calls for Superior Patient Experience and Analytics."
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#screenshot7",
            "url": "https://voicestack.com/assets/schema/schema-screenshot-voicestack-07.jpg",
            "width": 1200,
            "height": 630,
            "caption": "AI chatbots, integrated forms, and automated workflows centralize patient data and manage all appointments, calls, and follow-ups."
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#screenshot8",
            "url": "https://voicestack.com/assets/schema/schema-screenshot-voicestack-08.jpg",
            "width": 1200,
            "height": 630,
            "caption": "Reliable, scalable cloud calling integrates all voice, video, and messaging for effortless, secure business communication."
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#screenshot9",
            "url": "https://voicestack.com/assets/schema/schema-screenshot-voicestack-09.jpg",
            "width": 1200,
            "height": 630,
            "caption": "AI analyzes call performance for instant insights, tracking key metrics and providing coaching tools for smarter business decisions."
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#screenshot10",
            "url": "https://voicestack.com/assets/schema/schema-screenshot-voicestack-10.jpg",
            "width": 1200,
            "height": 630,
            "caption": "Real-time dashboards and custom reports provide full visibility into calls, chats, and CRM data to ensure data-driven growth."
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#screenshot11",
            "url": "https://voicestack.com/assets/schema/schema-screenshot-voicestack-11.jpg",
            "width": 1200,
            "height": 630,
            "caption": "Enhance patient experience with AI call scoring, analytics, and automation to improve communication and processes."
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#screenshot12",
            "url": "https://voicestack.com/assets/schema/schema-screenshot-voicestack-12.jpg",
            "width": 1200,
            "height": 630,
            "caption": "Centralize calls, build remote teams, and configure rules to seamlessly transfer calls between AI, agents, and call centers."
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#screenshot13",
            "url": "https://voicestack.com/assets/schema/schema-screenshot-voicestack-13.jpg",
            "width": 1200,
            "height": 630,
            "caption": "Track call outcomes, analyze call transcripts and follow-up on missed opportunities to convert more new patients with the power of AI."
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#screenshot14",
            "url": "https://voicestack.com/assets/schema/schema-screenshot-voicestack-14.jpg",
            "width": 1200,
            "height": 630,
            "caption": "Use Attribution Analytics to track top marketing channels, identify best patient acquisition sources, and optimize your budget for maximum ROI."
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#screenshot15",
            "url": "https://voicestack.com/assets/schema/schema-screenshot-voicestack-15.jpg",
            "width": 1200,
            "height": 630,
            "caption": "Deeply integrated into all major practice management systems, CRM systems and analytics platforms."
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#screenshot16",
            "url": "https://voicestack.com/assets/schema/schema-screenshot-voicestack-16.jpg",
            "width": 1200,
            "height": 630,
            "caption": "VoiceStack's superior AI phone system is compared side-by-side with Mango Voice, Peerlogic, and Patient Prism."
          },
          {
            "@type": "ImageObject",
            "@id": "https://voicestack.com/#screenshot17",
            "url": "https://voicestack.com/assets/schema/schema-screenshot-voicestack-17.jpg",
            "width": 1200,
            "height": 630,
            "caption": "AI transcription and call summaries enhance team training and conversions, while real-time analytics provide clear visibility for instantly optimizing marketing campaign strategies."
          }
        ],
        "video": [
          {
            "@type": "VideoObject",
            "@id": "https://voicestack.com/#video1",
            "url": "https://www.youtube.com/watch?v=dVku6w0tyBk",
            "name": "VoiceStack, the world’s first AI-powered phone system built for modern practices!",
            "description": "VoiceStack transforms the way practices handle front desks calls, ensuring no missed opportunities, smarter patient engagement, and revenue growth of up to $100K/month.",
            "uploadDate": "2025-04-01T00:00-08:00",
            "thumbnailUrl": "https://i3.ytimg.com/vi/dVku6w0tyBk/maxresdefault.jpg",
            "embedUrl": "https://www.youtube.com/embed/dVku6w0tyBk?si=angatjXetJeg_3h9",
            "author": {
              "@id": "https://voicestack.com/#organization"
            }
          },
          {
            "@type": "VideoObject",
            "@id": "https://voicestack.com/#video2",
            "url": "https://www.youtube.com/watch?v=wsVrybAXrOY",
            "name": "Himesh Kana | Dental Depot DFW | US | VoiceStack Review",
            "description": "Every day, thousands of marketing dollars are wasted at dental practices when patients call in to book an appointment but, for some reason, end up not booking. Maybe they would have booked if they had a payment plan option or a different time slot. Your staff may have missed out on offering these to the patient, and now the call has ended. So how can you get those patients back? VoiceStack can help.",
            "uploadDate": "2025-11-11T00:00-08:00",
            "thumbnailUrl": "https://i3.ytimg.com/vi/wsVrybAXrOY/maxresdefault.jpg",
            "embedUrl": "https://www.youtube.com/embed/wsVrybAXrOY?si=RSdKBaaz5vIxegRa",
            "author": {
              "@id": "https://voicestack.com/#organization"
            }
          },
          {
            "@type": "VideoObject",
            "@id": "https://voicestack.com/#video3",
            "url": "https://www.youtube.com/watch?v=SdNy_OZ2VGw",
            "name": "How VoiceStack Boosted Patient Conversions and Streamlined Dental Practice Operations",
            "description": "Learn how Dr. Robbie Hughes from Dental Excellence used VoiceStack to transform patient communication and streamline practice operations. VoiceStack helped his team identify 90% of missed patient calls, prioritize key consultations, and flag emergencies to deliver timely, high-quality care. With advanced call reviews and workflow optimization, Dr. Hughes achieved greater efficiency and improved patient experiences.",
            "uploadDate": "2025-01-11T00:00-08:00",
            "thumbnailUrl": "https://i3.ytimg.com/vi/SdNy_OZ2VGw/maxresdefault.jpg",
            "embedUrl": "https://www.youtube.com/embed/SdNy_OZ2VGw?si=iQjw5cbn1M9Q5Xjz",
            "author": {
              "@id": "https://voicestack.com/#organization"
            }
          },
          {
            "@type": "VideoObject",
            "@id": "https://voicestack.com/#video4",
            "url": "https://www.youtube.com/watch?v=p239r-x8-3A",
            "name": "Transforming Dental Practices with VoiceStack: Dr. Simon Chard's Testimonial",
            "description": "Discover how VoiceStack’s AI-powered business phone system has revolutionized Rothley Lodge Dental! Hear from Dr. Simon Chard, Co-owner of the practice, as he shares how VoiceStack enhanced team communication, reclaimed 60% of AI-recognized opportunities, and elevated patient care. Ready to transform your dental practice with cutting-edge AI technology? Book your free demo today at voicestack.com.",
            "uploadDate": "2025-01-09T00:00-08:00",
            "thumbnailUrl": "https://i3.ytimg.com/vi/p239r-x8-3A/maxresdefault.jpg",
            "embedUrl": "https://www.youtube.com/embed/p239r-x8-3A?si=cr8rr7mbPgRocrY3",
            "author": {
              "@id": "https://voicestack.com/#organization"
            }
          }
        ],
        "offers": [
          {
            "@type": "Offer",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": "Varies",
              "priceCurrency": "USD",
              "description": "Subscription pricing varies by plan"
            },
            "url": "https://voicestack.com/pricing",
            "availability": "https://schema.org/InStock"
          }
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": 5.0,
          "ratingCount": 9,
          "bestRating": 5,
          "worstRating": 1
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Tim Hill"
            },
            "datePublished": "2025-11-01",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "reviewBody": "With VoiceStack, we now have complete visibility into every call, making it easy to track call quality, patient satisfaction, and booking outcomes. We can analyze performance at both the practice and enterprise level, see results by campaign, and measure how well we convert potential patients. It’s an incredible tool for data-driven growth."
          },
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Katie Post"
            },
            "datePublished": "2025-11-02",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "reviewBody": "After 30 days on VoiceStack, we identified 52 missed patient calls in our opportunity bucket. The AI organized each call with the patient’s details, allowing us to follow up and schedule them. This resulted in converting all 52 opportunities, generating approximately $78,000 in additional revenue for the practice."
          },
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Laura Dye"
            },
            "datePublished": "2025-11-03",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "reviewBody": "VoiceStack has been a game-changer for our two locations with a centralized call center. It tracks missed opportunities, boosts call conversion rates, and provides clear insights into call center needs. The AI feature transcribes calls into easy-to-read scripts, making it simple to review content and tone. It has streamlined workflows and positively impacted practice growth."
          },
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Stuart McGuiggan"
            },
            "datePublished": "2025-11-04",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "reviewBody": "VoiceStack helps us prioritize calls, identifying emergencies and patients seeking specific treatments. This allowed us to follow up quickly, securing over $100,000 in treatment. The AI call transcription also supports staff training, letting us review calls, provide guidance, and improve processes, enhancing both team performance and patient care across the practice."
          },
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Hardik Chodavadia"
            },
            "datePublished": "2025-11-05",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "reviewBody": "The biggest advantage of switching to VoiceStack has been gaining full visibility into our call data. Immediately, we could see how many calls were being missed and where in the process they were lost. With only 63% of calls answered and 15% missed due to process gaps, implementing VoiceStack helped us recover at least 12% of calls almost overnight."
          },
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Himesh Kana"
            },
            "datePublished": "2025-11-06",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "reviewBody": "VoiceStack has transformed our call management, increasing first-call answer rates to 95–97% and reducing missed calls to under 6%. AI-powered transcription scores patient likelihood to schedule, enabling fast follow-ups and better outcomes. Integrated with CareStack, it improves scheduling, boosts new patient numbers, and enhances team performance, creating measurable impact on both patients and practice growth."
          },
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Neel Patel"
            },
            "datePublished": "2025-11-07",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "reviewBody": "VoiceStack has brought clarity to our call data, helping us make actionable decisions. Answer rates have increased by 35%, leading to more new patients and higher production. The AI insights also support team training, allowing us to improve performance, optimize workflows, and make data-driven decisions without guesswork."
          },
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Kalpesh Patel"
            },
            "datePublished": "2025-11-08",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "reviewBody": "VoiceStack makes it easy to track team performance and coach effectively. The dashboard provides clear metrics, while AI transcribes calls and highlights tone, helping team members understand their own performance. Listening to calls with feedback and call scoring has significantly improved training, making a real difference in call quality and patient interactions."
          },
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Laura Rogers"
            },
            "datePublished": "2025-11-09",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "reviewBody": "Switching to VoiceStack from our old system has been a game-changer. With seamless integration into CareStack, its AI-powered transcription, summaries, and detailed reporting help us track answer and conversion rates, identify missed opportunities, and train our team effectively. VoiceStack has elevated visibility, performance, and the overall patient experience across all our offices."
          }
        ]
      },
      {
        "@type": "MobileApplication",
        "@id": "https://voicestack.com/#software-android",
        "name": "VoiceStack (Android)",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "ANDROID",
        "url": "https://play.google.com/store/apps/details?id=com.voicestack.mobile&hl=en_US",
        "mainEntityOfPage": "https://play.google.com/store/apps/details?id=com.voicestack.mobile&hl=en_US",
        "publisher": {
          "@id": "https://voicestack.com/#organization"
        },
        "brand": {
          "@id": "https://voicestack.com/#organization"
        },
        "offers": [
          {
            "@type": "Offer",
            "name": "Android App Download",
            "url": "https://play.google.com/store/apps/details?id=com.voicestack.mobile&hl=en_US",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@id": "https://www.google.com/#organization"
            }
          }
        ]
      },
      {
        "@type": "MobileApplication",
        "@id": "https://voicestack.com/#software-ios",
        "name": "VoiceStack (iOS)",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "iOS",
        "url": "https://apps.apple.com/us/app/voicestack/id6741469847",
        "mainEntityOfPage": "https://apps.apple.com/us/app/voicestack/id6741469847",
        "publisher": {
          "@id": "https://voicestack.com/#organization"
        },
        "brand": {
          "@id": "https://voicestack.com/#organization"
        },
        "offers": [
          {
            "@type": "Offer",
            "name": "iOS App Download",
            "url": "https://apps.apple.com/us/app/voicestack/id6741469847",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@id": "https://www.apple.com/#organization"
            }
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": "https://www.google.com/#organization",
        "name": "Google",
        "url": "https://www.google.com/"
      },
      {
        "@type": "Organization",
        "@id": "https://www.apple.com/#organization",
        "name": "Apple",
        "url": "https://www.apple.com/"
      }
    ]
  }
  return schema
}

export const formatOrganizationSchema = (props: any) => {
  const schema = 
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://voicestack.com/#organization",
        "name": "VoiceStack",
        "url": "https://voicestack.com/",
        "logo": "https://voicestack.com/assets/schema/schema-logo-voicestack-1200x1200.jpg",
        "image": "https://voicestack.com/assets/schema/schema-logo-voicestack-1200x1200.jpg",
        "description": "VoiceStack® is an award-winning, AI-powered phone system that's trusted by thousands of dentists, veterinarians, optometrists, and physical therapists.",
        "slogan": "The Most Advanced AI-Powered Phone System For Modern Practices.",
        "foundingDate": "2024",
        "foundingLocation": {
          "@type": "Place",
          "name": "Kissimmee, Florida",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Kissimmee",
            "addressRegion": "FL",
            "addressCountry": "US"
          }
        },
        "email": "support@voicestack.com",
        "knowsAbout": [
          "AI-powered phone systems",
          "VoIP software",
          "Dental practice communications",
          "Veterinary practice communications",
          "Optometry practice communications",
          "Physical therapy practice communications",
          "AI receptionist technology",
          "Call analytics",
          "Patient communication automation"
        ],
  
        "areaServed": {
          "@type": "Country",
          "name": "United States"
        },
  
        "founder": {
          "@type": "Person",
          "@id": "https://voicestack.com/#founder",
          "name": "Krishnan RV",
          "jobTitle": "Founder",
          "url": "https://voicestack.com/company/leadership-team",
          "sameAs": [
            "https://www.linkedin.com/in/ikris/",
            "https://resources.voicestack.com/author/krishnan-r-v"
          ]
        },
  
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "2954 Mallory Cir #209",
          "addressLocality": "Kissimmee",
          "addressRegion": "FL",
          "postalCode": "34747",
          "addressCountry": "US"
        },
  
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+14078336436",
            "email": "support@voicestack.com",
            "contactType": "Customer Service",
            "areaServed": {
              "@type": "Country",
              "name": "United States"
            },
            "availableLanguage": "en",
            "url": "https://voicestack.com/support"
          },
          {
            "@type": "ContactPoint",
            "telephone": "+14075596068",
            "email": "sales.us@voicestack.com",
            "contactType": "Sales",
            "areaServed": {
              "@type": "Country",
              "name": "United States"
            },
            "availableLanguage": "en",
            "url": "https://voicestack.com/sales"
          }
        ],
  
        "hasProduct": [
          { "@id": "https://voicestack.com/#software" },
          { "@id": "https://voicestack.com/#software-android" },
          { "@id": "https://voicestack.com/#software-ios" }
        ],
  
        "sameAs": [
          "https://www.facebook.com/voicestack/",
          "https://www.instagram.com/voicestack.ai/",
          "https://www.linkedin.com/company/voice-stack/",
          "https://www.youtube.com/@VoiceStack"
        ],
  
        "mainEntityOfPage": {
          "@id": "https://voicestack.com/#website"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://voicestack.com/#website",
        "url": "https://voicestack.com/",
        "name": "VoiceStack",
        "publisher": {
          "@id": "https://voicestack.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://voicestack.com/?s={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  } 
  
  return schema
}

export default function showCountryFlag(region: string) {
  if (region === 'en') {
    return en.src
  } else if (region === 'en-GB') {
    return enGb.src
  } else if (region === 'en-AU') {
    return enAu.src
  }
}


export function capturePosthogEvent(eventName: string, event: Record<string, unknown>) {
  if (typeof window === 'undefined' || !posthog) return
  if (window.location.host.startsWith('localhost')) {
    posthog.debug()
  }
  posthog.capture(eventName, event)
}

export function capturePosthogDemoPage(eventName: string, event: Record<string, unknown>) {
  if (typeof window === 'undefined' || !posthog) return
  if (window.location.host.startsWith('localhost')) {
    posthog.debug()
  }
  posthog.capture(eventName, event)
}