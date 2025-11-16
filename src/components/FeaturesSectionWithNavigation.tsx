'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { urlForImage } from '~/lib/sanity.image'
import { projectId, dataset } from '~/lib/sanity.api'
import Container from './structure/Container'
import Button from './common/Button'
import SwitchableTabs from './revamp/components/common/switchableTabs'



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
  categories: IntegrationCategory[]
  integrations: IntegrationList[]
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  name,
  description,
  icon,
  className = ""
}) => {
  return (
    <div className={`bg-[#f4f3fa] relative rounded-3xl overflow-hidden  ${className}`}>
      <div className="p-6 space-y-6">
        {/* Icon */}
        <div className="bg-gradient-to-b from-vs-blue to-[#191078] relative rounded-xl w-10 h-10 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-white/20 rounded-xl" />
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img 
              alt={name} 
              className="w-full h-full object-cover" 
              src={icon} 
              onError={(e) => {
                e.currentTarget.src = '/placeholder-icon.svg';
              }}
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          <h3 className="md:text-lg text-base font-bold text-gray-950 font-manrope">
            {name}
          </h3>
          <p className="md:text-base text-sm text-[#364153] leading-6 font-geist">
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
          <h2 className="md:text-3xl text-xl font-bold text-zinc-950 mb-4 font-manrope">
            {title}
          </h2>
          <p className="md:text-base text-sm text-[#364153] leading-6 font-geist">
            {description}
          </p>
        </div>
        <p className="md:text-base text-sm text-[#6a7282] font-geist">
          {integrationCount}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
      data-category-id={id}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
        isActive 
          ? 'bg-gray-100 md:border-l-2 md:border-gray-950' 
          : 'hover:bg-gray-50 md:border-l-2 md:border-gray-200'
      }`}
    >
      <div className="w-5 h-5 flex-shrink-0">
        {renderIcon(category, isActive)}
      </div>
      <span className={`text-sm md:text-base font-geist ${
        isActive ? 'font-medium text-gray-950' : 'font-normal text-gray-950 opacity-70'
      }`}>
        {label}
      </span>
    </button>
  )
}

const FeaturesSectionWithNavigation: React.FC<FeaturesSectionWithNavigationProps> = ({ 
  categories, 
  integrations 
}) => {
  const [activeSection, setActiveSection] = useState('')
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const activeCategoryRef = useRef<string>('')
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  // Set first category as active when categories are loaded
  useEffect(() => {
    if (categories && categories.length > 0 && !activeSection) {
      setActiveSection(categories[0]._id)
      activeCategoryRef.current = categories[0]._id
    }
  }, [categories, activeSection])


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
          src={urlForImage(category.icon, { width: 20, height: 20 }) || '/placeholder-icon.svg'}
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
  const navigationItems = (categories || []).map((category) => ({
    id: category._id,
    label: category.name,
    category: category // Pass the full category object for icon rendering
  }))

  // Transform data for SwitchableTabs (mobile navigation)
  const switchableTabsData = (categories || []).map((category) => ({
    id: category._id,
    key: category._id,
    title: category.name,
    testimonial: null, // Not needed for this use case
    setActiveTab: (key: string) => handleCategoryClick(key) // Required by interface
  }))

  // Create feature sections from categories and their integrations
  const featureSections = useMemo(() => {
    return (categories || []).map((category) => {
      const categoryIntegrations = groupedIntegrations[category._id] || []
      
      return {
        id: category._id,
        title: category.name,
        description: category.description || category.subheading || '',
        integrationCount: `${categoryIntegrations.length} Integration${categoryIntegrations.length !== 1 ? 's' : ''}`,
        integrations: categoryIntegrations.map((integration) => {
          let iconUrl = '/placeholder-icon.svg'
          
          try {
            if (integration.image) {
              // Check if we have a direct URL (from dereferenced asset)
              if (integration.image.url) {
                iconUrl = integration.image.url;
              } else if (integration.image.asset && integration.image.asset.url) {
                // Fallback: check if asset has URL
                iconUrl = integration.image.asset.url;
              } else {
                // Fallback: try urlForImage for Sanity asset references
                const url = urlForImage(integration.image, { width: 32, height: 32 });
                iconUrl = url || '/placeholder-icon.svg'
              }
            }
          } catch (error) {
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
  }, [categories, groupedIntegrations])

  // Scroll-based category highlighting using scroll event listeners
  useEffect(() => {
    if (typeof window === 'undefined' || !featureSections || featureSections.length === 0) {
      return undefined
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150 // Offset for header
      let activeCategoryId = ''

      // Find which section is currently in view
      featureSections.forEach((section) => {
        const element = sectionRefs.current[section.id]
        if (element) {
          const elementTop = element.offsetTop
          const elementBottom = elementTop + element.offsetHeight
          
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            activeCategoryId = section.id
          }
        }
      })

      // Update active section if it changed
      if (activeCategoryId && activeCategoryId !== activeCategoryRef.current) {
        setActiveSection(activeCategoryId)
        activeCategoryRef.current = activeCategoryId
      }
    }

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [featureSections])

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

  // Handle category button click
  const handleCategoryClick = useCallback((categoryId: string) => {
    // Update active category immediately
    activeCategoryRef.current = categoryId;
    setActiveSection(categoryId);
    
    // Scroll to section
    scrollToSection(categoryId);
  }, [scrollToSection]);


  if (!categories || categories.length === 0) {
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
    <section className="bg-[#f9f9f9] xl:py-lg md:py-md py-sm">  
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <Container className="">
        <div className="flex flex-col md:flex-row gap-6 w-full">
           {/* Mobile Navigation - SwitchableTabs */}
             <SwitchableTabs
               data={switchableTabsData}
               setActiveTab={(categoryId: string) => handleCategoryClick(categoryId)}
               activeTab={activeSection}
               className="md:hidden block"
               isShowImage={false}
               isSticky={true}
             />
          

           {/* Desktop Navigation Sidebar */}
           <div className="w-full md:w-[293px] flex-shrink-0 sticky top-24 h-fit hidden md:block">
             <div className="flex flex-col space-y-3">
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
            <div className="mt-6 pt-6 border-t border-gray-200 md:block hidden">
              {/* <p className="text-base text-[#71717b] mb-5 font-geist">
                For Smarter Patient Call Management
              </p> */}
              <Button type='primary' className='w-full' link="/demo">
                <span>Book Free Demo</span>
              </Button>
            </div>
          </div>

           {/* Main Content */}
           <div className="flex-1 w-full md:w-auto">
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
      </Container>
    </section>
  )
}

export default FeaturesSectionWithNavigation