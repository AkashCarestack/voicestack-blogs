'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import { getClient } from '~/lib/sanity.client'
import { urlForImage } from '~/lib/sanity.image'

// External image URLs from Figma (for CTA button)
const img10 = "https://www.figma.com/api/mcp/asset/51f6ee12-cf09-438a-950c-ed6ac43a291d"

interface IntegrationCardProps {
  name: string
  description: string
  icon: string
  className?: string
}

interface IntegrationCategory {
  _id: string
  name: string
  subheading?: string
  description?: string
  mainImage?: any
  icon?: any
  iconSvgCode?: string
  language: string
}

interface IntegrationList {
  _id: string
  title: string
  headline: string
  description?: any
  shortDescription?: string
  image?: any
  link?: string
  integrationCategory?: {
    _id: string
    name: string
    subheading?: string
    description?: string
    mainImage?: any
    icon?: any
    iconSvgCode?: string
  }
  language: string
}

interface FeaturesSectionWithNavigationProps {
  // No props needed - language is auto-detected from route
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  name,
  description,
  icon,
  className = ""
}) => {
  return (
    <div className={`bg-[#f4f3fa] relative rounded-3xl overflow-hidden group hover:scale-105 transition-transform duration-300 ${className}`}>
      <div className="p-6 space-y-6">
        {/* Icon */}
        <div className="bg-gradient-to-b from-vs-blue to-[#191078] relative rounded-xl w-10 h-10 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-white/20 rounded-xl" />
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img alt={name} className="w-full h-full object-cover" src={icon} />
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-950 font-manrope">
            {name}
          </h3>
          <p className="text-base text-[#364153] leading-6 font-geist">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

interface FeatureSectionProps {
  id: string
  title: string
  description: string
  integrations: IntegrationCardProps[]
  integrationCount: string
  className?: string
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  id,
  title,
  description,
  integrations,
  integrationCount,
  className = ""
}) => {
  return (
    <section id={id} className={`py-16 first:pt-0 ${className}`}>
      <div className="flex items-end justify-between mb-6">
        <div className="max-w-[396px]">
          <h2 className="text-3xl font-bold text-zinc-950 mb-4 font-manrope">
            {title}
          </h2>
          <p className="text-base text-[#364153] leading-6 font-geist">
            {description}
          </p>
        </div>
        <p className="text-base text-[#6a7282] font-geist">
          {integrationCount}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration, index) => (
          <IntegrationCard
            key={index}
            {...integration}
          />
        ))}
      </div>
    </section>
  )
}

interface NavigationItemProps {
  id: string
  label: string
  category: IntegrationCategory
  isActive: boolean
  onClick: () => void
  renderIcon: (category: IntegrationCategory, isActive: boolean) => React.ReactNode
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  id,
  label,
  category,
  isActive,
  onClick,
  renderIcon
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-5 py-2 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-gray-100 border-l-2 border-gray-950' 
          : 'hover:bg-gray-50 border-l-2 border-gray-200'
      }`}
    >
      <div className="w-5 h-5 flex-shrink-0">
        {renderIcon(category, isActive)}
      </div>
      <span className={`text-base font-geist ${
        isActive ? 'font-medium text-gray-950' : 'font-normal text-gray-950 opacity-70'
      }`}>
        {label}
      </span>
    </button>
  )
}

const FeaturesSectionWithNavigation: React.FC<FeaturesSectionWithNavigationProps> = () => {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('')
  const [categories, setCategories] = useState<IntegrationCategory[]>([])
  const [integrations, setIntegrations] = useState<IntegrationList[]>([])
  const [loading, setLoading] = useState(true)
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const categoryRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const activeCategoryRef = useRef<string>('')
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get language from route locale
  const language = router.locale || 'en'

  // Fetch data from CMS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = getClient()
        
        // Fetch integration categories
        const categoriesQuery = `*[_type == "integrationCategory" && language == $language] | order(name asc) {
          _id,
          name,
          subheading,
          description,
          mainImage {
            asset-> {
              _id,
              url
            }
          },
          icon {
            asset-> {
              _id,
              url
            }
          },
          iconSvgCode,
          language
        }`
        
        // Fetch integration list
        const integrationsQuery = `*[_type == "integrationList" && language == $language] | order(order asc, title asc) {
          _id,
          title,
          headline,
          description,
          shortDescription,
          image {
            asset-> {
              _id,
              url
            }
          },
          link,
          integrationCategory-> {
            _id,
            name,
            subheading,
            description,
            mainImage {
              asset-> {
                _id,
                url
              }
            },
            icon {
              asset-> {
                _id,
                url
              }
            },
            iconSvgCode
          },
          language
        }`
        
        const [categoriesData, integrationsData] = await Promise.all([
          client.fetch(categoriesQuery, { language }),
          client.fetch(integrationsQuery, { language })
        ])
        
        setCategories(categoriesData)
        setIntegrations(integrationsData)
        
        // Set first category as active
        if (categoriesData.length > 0) {
          setActiveSection(categoriesData[0]._id)
          activeCategoryRef.current = categoriesData[0]._id
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching integration data:', error)
        setLoading(false)
      }
    }
    
    fetchData()
  }, [language])

  // Intersection Observer for smooth category highlighting (same as CategoryFeatureTabs)
  useEffect(() => {
    // Only run observer if user is not manually scrolling
    if (isUserScrolling) return;

    const observerOptions = {
      root: null,
      rootMargin: '-120px 0px -40% 0px',
      threshold: [0.1, 0.5, 0.8]
    };

    const observer = new IntersectionObserver((entries) => {
      // Skip if user is manually scrolling
      if (isUserScrolling) return;
      
      let mostVisibleEntry = null;
      let highestRatio = 0;
      
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
          highestRatio = entry.intersectionRatio;
          mostVisibleEntry = entry;
        }
      });
      
      if (mostVisibleEntry && highestRatio > 0.3) {
        const categoryId = mostVisibleEntry.target.getAttribute('data-category');
        if (categoryId && categoryId !== activeCategoryRef.current) {
          setActiveSection(categoryId);
          activeCategoryRef.current = categoryId;
        }
      }
    }, observerOptions);

    // Observe all sections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [categories, isUserScrolling]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Group integrations by category
  const groupedIntegrations = integrations.reduce((acc, integration) => {
    if (integration.integrationCategory) {
      const categoryId = integration.integrationCategory._id
      if (!acc[categoryId]) {
        acc[categoryId] = []
      }
      acc[categoryId].push(integration)
    }
    return acc
  }, {} as Record<string, IntegrationList[]>)

  // Render category icon (same logic as CategoryFeatureTabs)
  const renderCategoryIcon = (category: IntegrationCategory, isActive: boolean = false) => {
    if (category.iconSvgCode) {
      let modifiedSvg = category.iconSvgCode;
      
      if (isActive) {
        modifiedSvg = modifiedSvg
          .replace(/stroke="[^"]*"/g, 'stroke="#000000"')
          .replace(/stroke='[^']*'/g, "stroke='#000000'");
      } else {
        modifiedSvg = modifiedSvg
          .replace(/stroke="[^"]*"/g, 'stroke="currentColor"')
          .replace(/stroke='[^']*'/g, "stroke='currentColor'");
      }
      
      return (
        <div 
          className="flex items-center justify-center w-5 h-5"
          dangerouslySetInnerHTML={{
            __html: modifiedSvg
          }}
        />
      );
    } else if (category.icon && category.icon.asset?.url) {
      return (
        <img
          src={urlForImage(category.icon, { width: 20, height: 20 })}
          alt={category.name}
          className="w-5 h-5 object-contain"
        />
      );
    } else {
      return (
        <div className="flex items-center justify-center w-5 h-5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke={isActive ? "#000000" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    }
  };

  // Create navigation items from categories
  const navigationItems = categories.map((category) => ({
    id: category._id,
    label: category.name,
    category: category // Pass the full category object for icon rendering
  }))

  // Create feature sections from categories and their integrations
  const featureSections = categories.map((category) => {
    const categoryIntegrations = groupedIntegrations[category._id] || []
    
    return {
      id: category._id,
      title: category.name,
      description: category.description || category.subheading || '',
      integrationCount: `${categoryIntegrations.length} Integration${categoryIntegrations.length !== 1 ? 's' : ''}`,
      integrations: categoryIntegrations.map((integration) => {
        let iconUrl = '/placeholder-icon.svg'
        
        try {
          if (integration.image && integration.image.asset) {
            // Check if we have a direct URL (from query)
            if (integration.image.asset.url) {
              iconUrl = integration.image.asset.url;
            } else {
              // Try urlForImage for Sanity asset references
              const url = urlForImage(integration.image, { width: 32, height: 32 });
              iconUrl = url || '/placeholder-icon.svg'
            }
          }
        } catch (error) {
          console.warn('Error processing integration image:', error)
          iconUrl = '/placeholder-icon.svg'
        }
        
        return {
          name: integration.title,
          description: integration.shortDescription || integration.headline || '',
          icon: iconUrl
        }
      })
    }
  })

  // Smooth scroll to section (same as CategoryFeatureTabs)
  const scrollToSection = useCallback((sectionId: string) => {
    const section = sectionRefs.current[sectionId];
    if (section) {
      const headerHeight = 100; // Adjust this value based on your header height
      const elementPosition = section.offsetTop;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  // Handle category button click (same as CategoryFeatureTabs)
  const handleCategoryClick = useCallback((categoryId: string) => {
    console.log('Category clicked:', categoryId);
    
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Disable intersection observer FIRST
    setIsUserScrolling(true);
    
    // Update active category immediately in ref AND state
    activeCategoryRef.current = categoryId;
    setActiveSection(categoryId);
    
    // Use requestAnimationFrame to ensure state is updated before scroll
    requestAnimationFrame(() => {
      // Scroll to section
      scrollToSection(categoryId);
      
      // Re-enable intersection observer after scroll completes
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 1500);
    });
  }, [scrollToSection]);

  // Intersection Observer to update active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
      }
    )

    // Observe all sections
    featureSections.forEach((section) => {
      const element = sectionRefs.current[section.id]
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  if (loading) {
    return (
      <section className="bg-[#f9f9f9] py-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vs-blue mx-auto mb-4"></div>
              <p className="text-gray-600 font-geist">Loading integrations...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return (
      <section className="bg-[#f9f9f9] py-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-gray-600 font-geist">No integration categories found.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#f9f9f9] py-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-6">
          {/* Sticky Navigation Sidebar */}
          <div className="w-[293px] flex-shrink-0 sticky top-24 h-fit">
            <div className="space-y-3">
              {navigationItems.map((item) => (
                <NavigationItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  category={item.category}
                  isActive={activeSection === item.id}
                  onClick={() => handleCategoryClick(item.id)}
                  renderIcon={renderCategoryIcon}
                />
              ))}
            </div>
            
            {/* CTA Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-base text-[#71717b] mb-5 font-geist">
                For Smarter Patient Call Management
              </p>
              <button className="bg-vs-lemon-green hover:bg-vs-lemon-green/90 text-gray-950 font-medium px-6 py-3 rounded-lg transition-colors duration-200 relative group font-geist">
                <span className="relative z-10">Book Free Demo</span>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <img alt="" className="w-[126px] h-5" src={img10} />
                </div>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {featureSections.map((section) => (
              <div
                key={section.id}
                ref={(el) => (sectionRefs.current[section.id] = el)}
                data-category={section.id}
              >
                <FeatureSection {...section} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSectionWithNavigation

