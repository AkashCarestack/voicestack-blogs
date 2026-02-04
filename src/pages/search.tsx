import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Anchor from "~/components/common/anchor";

// Exclude list for pages that shouldn't appear in search results
const EXCLUDED_SLUGS = [
  'test-shakir',
  'ref',
  'test2',
  'test',
  'landing', // Exclude landing pages from search
];

// Helper function to extract plain text from blockContent/portable text
function extractTextFromBlocks(blocks: any[]): string {
  if (!Array.isArray(blocks)) return '';
  
  return blocks
    .map((block: any) => {
      if (block._type === 'block' && block.children) {
        return block.children
          .map((child: any) => child.text || '')
          .join(' ');
      }
      return '';
    })
    .filter(Boolean)
    .join(' ')
    .trim();
}

// Helper function to filter out internal names and slugs
function isInternalName(text: string): boolean {
  if (!text) return true;
  const lowerText = text?.toString().toLowerCase().trim();
  
  // Common internal patterns to exclude
  const internalPatterns = [
    /^tab\d+$/i, // tab1, tab2, etc.
    /\bhero\b/i, // contains "hero" as a word (e.g., "why voicestack hero")
    /\btestimonial\b/i, // contains "testimonial" as a word
    /^stack card/i, // starts with "stack card"
    /stack card tab/i, // "stack card tab testimonial"
    /\bcomponent\b/i, // contains "component" as a word
    /^section \d+$/i, // "section 1", etc.
    /why voicestack hero/i, // specific internal name
    /^why\s+voicestack\s+hero$/i, // exact match
  ];
  
  // Check if text matches internal patterns
  for (const pattern of internalPatterns) {
    if (pattern.test(lowerText)) {
      return true;
    }
  }
  
  // Check if it's a slug-like string (all lowercase with hyphens, no spaces)
  if (/^[a-z0-9-]+$/.test(lowerText) && lowerText.includes('-') && !lowerText.includes(' ')) {
    return true;
  }
  
  // Check for common internal naming patterns (lowercase with specific keywords)
  const internalKeywords = ['hero', 'testimonial', 'component', 'tab'];
  const hasInternalKeyword = internalKeywords.some(keyword => 
    lowerText.includes(keyword) && lowerText.length < 50 // short phrases with these keywords are likely internal
  );
  
  // If it's a short phrase containing internal keywords and looks like a label/name, exclude it
  if (hasInternalKeyword && lowerText.split(/\s+/).length <= 4) {
    // But allow if it's actual content (has more descriptive words)
    const descriptiveWords = ['grow', 'practice', 'power', 'ai', 'features', 'business', 'results', 'real'];
    const hasDescriptiveContent = descriptiveWords.some(word => lowerText.includes(word));
    if (!hasDescriptiveContent) {
      return true;
    }
  }
  
  return false;
}

// Helper function to get content preview from various content fields
function getContentPreview(item: any): string {
  const parts: string[] = [];
  
  // Try description first
  if (item.description) {
    if (typeof item.description === 'string' && !isInternalName(item.description)) {
      parts.push(item.description);
    } else if (Array.isArray(item.description)) {
      const text = extractTextFromBlocks(item.description);
      if (text && !isInternalName(text)) parts.push(text);
    }
  }
  
  // Try content.sections for structured content (prioritize this for whyVoicestack pages)
  if (item.content?.sections && Array.isArray(item.content.sections)) {
    item.content.sections.forEach((section: any) => {
      // Skip section title if it looks like an internal name (e.g., "why voicestack hero")
      // Only include if it's actual content (has descriptive words)
      if (section.title) {
        const titleLower = section.title.toLowerCase();
        // Check if it's likely an internal name
        const isLikelyInternal = 
          titleLower.includes('hero') && titleLower.length < 30 ||
          titleLower.includes('testimonial') && titleLower.length < 30 ||
          titleLower.includes('component') && titleLower.length < 30 ||
          /^(why|stack|tab)\s/.test(titleLower); // starts with internal keywords
        
        if (!isLikelyInternal && !isInternalName(section.title)) {
          parts.push(section.title);
        }
      }
      
      // Extract from tabsListingComponent
      if (section.component?.tabsListingComponent) {
        const tabsComp = section.component.tabsListingComponent;
        if (tabsComp.headline && !isInternalName(tabsComp.headline)) {
          parts.push(tabsComp.headline);
        }
        if (tabsComp.subheadline && !isInternalName(tabsComp.subheadline)) {
          parts.push(tabsComp.subheadline);
        }
        if (tabsComp.subDescription && !isInternalName(tabsComp.subDescription)) {
          parts.push(tabsComp.subDescription);
        }
        if (tabsComp.content) {
          const text = extractTextFromBlocks(tabsComp.content);
          if (text && !isInternalName(text)) parts.push(text);
        }
        // Add tab headings (but skip internal tab numbers)
        if (tabsComp.tabs && Array.isArray(tabsComp.tabs)) {
          tabsComp.tabs.forEach((tab: any) => {
            if (tab.tabHeading && !isInternalName(tab.tabHeading)) {
              parts.push(tab.tabHeading);
            }
            if (tab.tabSubHeading && !isInternalName(tab.tabSubHeading)) {
              parts.push(tab.tabSubHeading);
            }
            if (tab.description && !isInternalName(tab.description)) {
              parts.push(tab.description);
            }
          });
        }
      }
      
      // Extract from customComponent
      if (section.component?.customComponent) {
        const customComp = section.component.customComponent;
        if (customComp.title && !isInternalName(customComp.title)) {
          parts.push(customComp.title);
        }
        if (customComp.subtitle && !isInternalName(customComp.subtitle)) {
          parts.push(customComp.subtitle);
        }
        if (customComp.content) {
          const text = extractTextFromBlocks(customComp.content);
          if (text && !isInternalName(text)) parts.push(text);
        }
      }
    });
  }
  
  // Try content field (for whoWeServe, dentalPhones, etc.) - only if no sections found
  if (parts.length === 0 && item.content && Array.isArray(item.content)) {
    const text = extractTextFromBlocks(item.content);
    if (text && !isInternalName(text)) parts.push(text);
  }
  
  // Try overview or shortDescription for features
  if (parts.length === 0) {
    if (item.overview) {
      if (typeof item.overview === 'string' && !isInternalName(item.overview)) {
        parts.push(item.overview);
      } else if (Array.isArray(item.overview)) {
        const text = extractTextFromBlocks(item.overview);
        if (text && !isInternalName(text)) parts.push(text);
      }
    }
    
    if (item.shortDescription && !isInternalName(item.shortDescription)) {
      parts.push(item.shortDescription);
    }
  }
  
  // Filter out duplicates and join
  const uniqueParts = Array.from(new Set(parts.filter(Boolean)));
  let preview = uniqueParts.join(' ').trim();
  
  // Final cleanup: remove common internal phrases from the combined preview
  const internalPhrases = [
    'why voicestack hero',
    'stack card tab testimonial',
    'stack card',
    'tab testimonial',
  ];
  
  for (const phrase of internalPhrases) {
    // Remove the phrase (case insensitive) and clean up extra spaces
    const regex = new RegExp(phrase.replace(/\s+/g, '\\s+'), 'gi');
    preview = preview.replace(regex, '').replace(/\s+/g, ' ').trim();
  }
  
  return preview;
}

// Helper function to map document types and slugs to URLs (from sitemap logic)
function getPathForPage(page: { _type: string; slug: string }): string {
  const slug = page.slug || '';
  
  if (slug === 'landing') {
    if (page._type === 'whoWeServe' || page._type === 'whoWeServePage' || page._type === 'whyVoicestack') {
      return '/who-we-serve';
    } else if (page._type === 'dentalPhones' || page._type === 'dentalSoftware') {
      return '/dental-phones';
    }
    return '/';
  }
  
  if (page._type === 'whoWeServe' || page._type === 'whoWeServePage') {
    return `/who-we-serve/${slug}`;
  } else if (page._type === 'dentalPhones' || page._type === 'dentalPhonesPage') {
    return `/dental-phones/${slug}`;
  } else if (page._type === 'whyVoicestack') {
    return `/who-we-serve/${slug}`;
  } else if (page._type === 'feature') {
    return `/dental-phones/features/${slug}`;
  } else if (page._type === 'page') {
    return `/${slug}`;
  }
  
  return slug ? `/${slug}` : '/';
}

// Helper function to check if a page should be excluded
function shouldExcludePage(slug: string, path: string): boolean {
  // Check exact slug matches
  if (EXCLUDED_SLUGS.includes(slug)) {
    return true;
  }
  
  // Check if path contains excluded patterns
  for (const excluded of EXCLUDED_SLUGS) {
    if (path.includes(`/${excluded}`) || path.includes(`/${excluded}/`)) {
      return true;
    }
  }
  
  // Exclude test pages
  if (slug.startsWith('test') || path.includes('/test')) {
    return true;
  }
  
  return false;
}

export default function SearchPage() {
  const router = useRouter();
  const { s } = router.query;
  const locale = router.locale || 'en';

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!s || typeof s !== 'string') return;

    // Extract search query as string after type guard
    const searchQuery = s;

    async function fetchResults() {
      setLoading(true);
      try {
        // Use server-side API route instead of direct client-side Sanity calls
        const response = await fetch(`/api/search?s=${encodeURIComponent(searchQuery)}&locale=${encodeURIComponent(locale)}`);
        
        if (!response.ok) {
          throw new Error('Search request failed');
        }
        
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [s, locale]);

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Search results for &quot;{s}&quot;</h1>

      {loading && <p className="text-gray-600">Searching...</p>}

      {!loading && results.length === 0 && s && (
        <p className="text-gray-600">No results found.</p>
      )}

      {!loading && results.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
          <ul className="space-y-4">
            {results.map((item: any) => {
              const path = getPathForPage({ _type: item._type, slug: item.slug });
              const href = locale && locale !== 'en' ? `/${locale}${path}` : path;
              const preview = item.preview || '';
              const previewText = typeof preview === 'string' 
                ? preview 
                : extractTextFromBlocks(preview);
              // Clean up preview - remove extra whitespace and truncate
              const cleanedPreview = previewText.replace(/\s+/g, ' ').trim();
              const truncatedPreview = cleanedPreview.length > 200 
                ? cleanedPreview.substring(0, 200) + '...' 
                : cleanedPreview;
              
              return (
                <li key={item._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                  <Anchor
                    href={href}
                    className="block"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 mb-2">
                      {item.title || 'Untitled'}
                    </h2>
                    {truncatedPreview && (
                      <p className="text-gray-600 mb-3 leading-relaxed">
                        {truncatedPreview}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-400 font-mono">
                        {href}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {item._type}
                      </span>
                    </div>
                  </Anchor>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
