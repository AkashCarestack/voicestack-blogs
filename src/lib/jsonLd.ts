export function faqJsonLd(faqList: any[]) {
    const mainEntity = faqList.map((faq) => {
      return {
        "@type": "Question",
        "name": faq.headLine,
        "text": faq.headLine,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.subHeading,
        }
      };
    });
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity,
    };
  }
  
  export function breadCrumbJsonLd(breadCrumbList: any[]) {
    const baseUrl = `https://VoiceStack.com`;
    const itemListElement = breadCrumbList.map((item, index) => {
      return index !== breadCrumbList.length - 1
        ? {
            "@type": "ListItem",
            position: index + 2,
            name: item.breadcrumb,
            item: `${baseUrl}${item.href}/`,
          }
        : {
            "@type": "ListItem",
            position: index + 2,
            name: item.breadcrumb,
          };
    });
    return {
      "@context": "https://schema.org/",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${baseUrl}/`,
        },
        ...itemListElement,
      ],
    };
  }
  
  export function personJsonLd(person: any) {
    return {
      "@context": "https://schema.org/",
      "@type": "Person",
      name: person.headLine,
      image: person?.image[0]?.image.filename,
      jobTitle: person.subHeading,
      worksFor: {
        "@type": "Organization",
        name: "VoiceStack",
      },
    };
  }
  
  export function blogJsonLd(blog: any, route: string, content: any, author?: any, tag?: any) {
    const description = `${content[0].content[0].text} ${content[1].content[0].text}`;
    const basePath = `https://VoiceStack.com`;
    
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${basePath}${route}`,
        isPartOf: {
          "@id": "https://VoiceStack.com/#website",
        },
      },
      headline: blog.headLine,
      description,
      image:
        "https://a.storyblok.com/f/144863/1201x1201/a1d1cbd61c/VoiceStack-favicon-1200x1200.png",
      author: {
        "@type": "Person",
        name: blog.authorName? blog.authorName : author && author.length > 0 ? author[0].headLine : "",
        url: blog.authorInfo && blog.authorInfo.full_slug ? `https://VoiceStack.com/${blog.authorInfo.full_slug}` : "https://VoiceStack.com/company/leadership-team",
      },
      wordCount: blog.wordCount ?? 0,
      keywords: tag && tag.length > 0 ? tag : [] ,
      dateCreated: blog.date,
      inLanguage: "en-US",
      copyrightYear: blog.date.split(' ')[2] ?? blog.date.split('-')[0],
      copyrightHolder: {
        "@id": "https://VoiceStack.com/#organization",
      },
      publisher: {
        "@type": "Organization",
        name: "VoiceStack",
        url: "https://VoiceStack.com",
        logo: {
          "@type": "ImageObject",
          inLanguage: "en-US",
          url: "https://a.storyblok.com/f/144863/1201x1201/a1d1cbd61c/VoiceStack-favicon-1200x1200.png",
          width: 1200,
          height: 1200,
        },
      },
      
  
    };
  }
  export function videoJsonLd(video: any) {
    return {
      "@context": "https://schema.org",
        "@type": "VideoObject",
      "name": `${video.name} VoiceStack® Video Review | VoiceStack®`,
      "description": `${video.name} provides a video review of their first-hand experience using VoiceStack's Cloud-Based, Online Dental Practice Management Software.`,
      "thumbnailUrl": `https://i.ytimg.com/vi/${video.secondaryVideo?.[0]?.videoId}/0.jpg`,
      "duration": video.secondaryVideo?.[0]?.duration? video.secondaryVideo?.[0]?.duration : "PT5M5S",
      "contentUrl": `https://www.youtube.com/watch?v=${video.secondaryVideo?.[0]?.videoId}`,
      "embedUrl": `https://www.youtube.com/embed/${video.secondaryVideo?.[0]?.videoId}`,
      "uploadDate": video.date? video.date : "2025-10-14"
    };
  }
  
  export function aggregateJsonLd(average:number, length:number) {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": "SoftwareApplication",
        "applicationCategory": "Dental Software, Dental Practice Management Software, Cloud-based Dental Software",
        "name": "VoiceStack",
        "alternateName": "VoiceStack Dental Software",
        "url": "https://VoiceStack.com/dental-software",
        "availableOnDevice": "Desktop, Laptop, Tablet",
        "operatingSystem": "Cloud, SaaS, Web-Based, Desktop Mac, Desktop Windows, On-Premise Windows",
        "memoryRequirements": "4GB",
        "processorRequirements": "Intel Core i3",
        "permissions": "Broadband internet access",
        "countriesSupported": "US",
        "inLanguage": "English",
        "abstract": "All-In-One Dental Practice Management Software",
        "description": "VoiceStack dental software is your all-in-one solution for superior practice management. Like many dentists, we were tired of the same old software vendors who charge extra for basic features that should have long since been included in the standard offering. So, we created a modern and dynamic alternative.  Today, VoiceStack is known as the cloud dental software that can streamline operations and improve efficiency. Combined with advanced reporting and analytics to make monitoring your success a breeze, it’s the perfect fit for your dental practice.  For the ultimate dental software, choose the solution that’s scalable for growing dental start-ups or large DSOs and still affordable for small mobile providers and single-office dental practices.",
        "headline": "All-In-One Dental Practice Management Software",
        "image": "https://a.storyblok.com/f/144863/1200x1200/db11368ff8/VoiceStack-logo-1200x1200.jpg",
        "awards": [
          "2022 Software Advice FrontRunner",
          "2022 Software Suggest Trending",
          "2022 GetApp Category Leader",
          "2021 G2 High Performer",
          "2021 SoftwarePundit SMB10"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": `${average}`,
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": `${length}`
        },
        "featureList": [
          "Analytics & Reporting",
          "Appointment Reminders",
          "Backups",
          "Charting",
          "Clinical Notes",
          "Credit Card Processing",
          "Curbside Check-in",
          "Digital Imaging",
          "HIPAA Compliant",
          "Insurance Claims Management",
          "Insurance Verification",
          "Membership Plans",
          "Online Forms",
          "Online Payments",
          "Online Scheduling",
          "Patient Kiosk",
          "Patient Notifications",
          "Patient Portal",
          "Pay-by-text",
          "Payment Plans",
          "Payment Reminders",
          "Phone Integrations",
          "Remote Access",
          "Reputation Management",
          "Revenue Cycle Management",
          "Scheduling",
          "Teledentistry",
          "Text messaging",
          "Treatment Planning"
        ]
      }
  }
  // export function aggregateJsonLd(average:number, length:number) {
  //   return {
  //       "@context": "https://schema.org/",
  //       "@type": "Product",
  //       "name": "VoiceStack",
  //       "aggregateRating": {
  //         "@type": "AggregateRating",
  //         "ratingValue": `${average}`,
  //         "bestRating": "5",
  //         "ratingCount": `${length}`
  //       }
  //   };
  // }
  