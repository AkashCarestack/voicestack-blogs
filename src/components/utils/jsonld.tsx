export function faqJsonLd(faqItems: any) {
    let allQuestions: any[] = [];
    
    if (faqItems?.faqCategories && Array.isArray(faqItems.faqCategories)) {
      faqItems.faqCategories.forEach((category: any) => {
        if (category?.questions && Array.isArray(category.questions)) {
          allQuestions = allQuestions.concat(category.questions);
        }
      });
    }
    else if (Array.isArray(faqItems)) {
      allQuestions = faqItems;
    }
    else if (faqItems?.questions && Array.isArray(faqItems.questions)) {
      allQuestions = faqItems.questions;
    }
    
    const mainEntity = allQuestions
      .map((faq: any) => {
        let questionText = '';
        if (typeof faq.question === 'string') {
          questionText = faq.question;
        } else if (faq.headLine) {
          questionText = faq.headLine;
        }
        
        // Extract answer text from portable text or string
        let answerText = '';
        if (typeof faq.answer === 'string') {
          answerText = faq.answer;
        } else if (faq.subHeading) {
          answerText = faq.subHeading;
        } else if (Array.isArray(faq.answer)) {
          answerText = faq.answer
            .filter((block: any) => block._type === 'block' && block.children)
            .map((block: any) => {
              if (!block.children || !Array.isArray(block.children)) return '';
              return block.children
                .filter((child: any) => child._type === 'span' && child.text)
                .map((child: any) => child.text || '')
                .join('')
            })
            .filter((text: string) => text.trim().length > 0)
            .join(' ');
        }
        
        if (!questionText || !answerText) {
          return null;
        }
        
        return {
          "@type": "Question",
          "name": questionText,
          "text": questionText,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": answerText,
          }
        };
      })
      .filter((item: any) => item !== null); 
    
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity,
    };
  }
  
  export function breadCrumbJsonLd(breadCrumbList: any[]) {
    const baseUrl = `https://carestack.com`;
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
        name: "Carestack",
      },
    };
  }
  
  export function blogJsonLd(blog: any, route: string, content: any, author?: any, tag?: any) {
    const description = `${content[0].content[0].text} ${content[1].content[0].text}`;
    const basePath = `https://carestack.com`;
    
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${basePath}${route}`,
        isPartOf: {
          "@id": "https://carestack.com/#website",
        },
      },
      headline: blog.headLine,
      description,
      image:
        "https://a.storyblok.com/f/144863/1201x1201/a1d1cbd61c/carestack-favicon-1200x1200.png",
      author: {
        "@type": "Person",
        name: blog.authorName? blog.authorName : author && author.length > 0 ? author[0].headLine : "",
        url: blog.authorInfo && blog.authorInfo.full_slug ? `https://carestack.com/${blog.authorInfo.full_slug}` : "https://carestack.com/company/leadership-team",
      },
      wordCount: blog.wordCount ?? 0,
      keywords: tag && tag.length > 0 ? tag : [] ,
      dateCreated: blog.date,
      inLanguage: "en-US",
      copyrightYear: blog.date.split(' ')[2] ?? blog.date.split('-')[0],
      copyrightHolder: {
        "@id": "https://carestack.com/#organization",
      },
      publisher: {
        "@type": "Organization",
        name: "CareStack",
        url: "https://carestack.com",
        logo: {
          "@type": "ImageObject",
          inLanguage: "en-US",
          url: "https://a.storyblok.com/f/144863/1201x1201/a1d1cbd61c/carestack-favicon-1200x1200.png",
          width: 1200,
          height: 1200,
        },
      },
      
  
    };
  }
  export function videoJsonLd(video: any) {
    if (!video) {
      return null;
    }

    const videoData = Array.isArray(video) ? video[0] : video;
    
    const { 
      videoPlatform, 
      videoId, 
      speakerName, 
      videoDuration, 
      videoUploadDate, 
      videoTitle, 
      videotitle, // lowercase variant
      videoDescription, 
      thumbnailUrl,
      videoThumbnail 
    } = videoData;

    // Generate URLs based on platform
    let contentUrl = '';
    let embedUrl = '';
    let thumbnail = thumbnailUrl;

    switch (videoPlatform) {
      case 'youtube':
        contentUrl = `https://www.youtube.com/watch?v=${videoId}`;
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
        if (!thumbnail) {
          thumbnail = `https://i.ytimg.com/vi/${videoId}/0.jpg`;
        }
        break;
      case 'vimeo':
        contentUrl = `https://vimeo.com/${videoId}`;
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
        break;
      case 'vidyard':
        contentUrl = `https://play.vidyard.com/${videoId}`;
        embedUrl = `https://play.vidyard.com/${videoId}`;
        break;
      default:
        // Default to YouTube format if platform not specified
        contentUrl = `https://www.youtube.com/watch?v=${videoId}`;
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
        if (!thumbnail) {
          thumbnail = `https://i.ytimg.com/vi/${videoId}/0.jpg`;
        }
    }

    // Generate name and description - handle both videoTitle and videotitle (lowercase)
    const title = videoTitle || videotitle;
    const name = title || (speakerName ? `${speakerName} Video Review | VoiceStack®` : 'Video | VoiceStack®');
    const description = videoDescription || (speakerName ? `${speakerName} provides a video review of their experience with VoiceStack.` : 'Video content from VoiceStack.');
    
    // Use videoThumbnail if thumbnailUrl is not available
    const finalThumbnail = thumbnail || (videoThumbnail ? (typeof videoThumbnail === 'string' ? videoThumbnail : videoThumbnail.url || videoThumbnail.asset?.url) : null);

    return {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": name,
      "description": description,
      "thumbnailUrl": finalThumbnail || thumbnail,
      "duration": videoDuration || "PT5M5S",
      "contentUrl": contentUrl,
      "embedUrl": embedUrl,
      "uploadDate": videoUploadDate || new Date().toISOString().split('T')[0]
    };
  }