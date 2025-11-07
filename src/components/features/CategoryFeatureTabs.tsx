import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion} from 'framer-motion';
import Button from '../common/Button';
import ButtonArrow from '../icons/ButtonArrow';
import Section from '../structure/Section';
import Container from '../structure/Container';
import SectionHeader from '../revamp/components/common/sectionHeader';
import useMediaQuery from '~/utils/mediaQuery';

interface Feature {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  language: string;
  order?: number;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: any;
  mainImage?: any;
  shortDescription?: any;
  featureCategory?: {
    name: string;
    subheading?: string;
    description?: string;
    mainImage?: any;
    icon?: any;
    iconSvgCode?: string;
  };
}

interface CategoryFeatureTabsProps {
  features: Feature[];
}

export default function CategoryFeatureTabs({ features }: CategoryFeatureTabsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  
  // Refs for intersection observer
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const categoryRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const activeCategoryRef = useRef<string>('');
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mobileTabsRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery(1024);
  
  // Memoize the categories processing to prevent unnecessary re-renders
  const allCategories = useMemo(() => {
    // Add null/undefined check for features array
    if (!features || !Array.isArray(features)) {
      return [];
    }

    const featuresByCategory = features.reduce((acc, feature) => {
      // Only process features that have a proper category assigned
      if (feature.featureCategory && feature.featureCategory.name) {
        const category = feature.featureCategory;
        if (!acc[category.name]) {
          acc[category.name] = {
            category: category,
            features: []
          };
        }
        acc[category.name].features.push(feature);
      }
      // Skip features without categories - no dummy "Other Features" category
      return acc;
    }, {} as Record<string, { category: any; features: Feature[] }>);

    return Object.keys(featuresByCategory).map(categoryName => {
      const categoryData = featuresByCategory[categoryName];
      return {
        name: categoryName,
        subheading: categoryData.category.subheading,
        description: categoryData.category.description || categoryName,
        mainImage: categoryData.category.mainImage,
        icon: categoryData.category.icon,
        iconSvgCode: categoryData.category.iconSvgCode,
        features: categoryData.features
      };
    });
  }, [features]);

  // Center active tab in mobile view
  const centerActiveTab = useCallback((categoryName: string) => {
    if (mobileTabsRef.current) {
      const activeTab = mobileTabsRef.current.querySelector(`[data-category="${categoryName}"]`) as HTMLElement;
      if (activeTab) {
        const container = mobileTabsRef.current;
        const containerWidth = container.offsetWidth;
        const tabOffsetLeft = activeTab.offsetLeft;
        const tabWidth = activeTab.offsetWidth;
        const scrollLeft = tabOffsetLeft - (containerWidth / 2) + (tabWidth / 2);
        
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, []);

  // Set initial active category
  useEffect(() => {
    if (allCategories.length > 0) {
      const firstCategory = allCategories[0].name;
      setActiveCategory(firstCategory);
      activeCategoryRef.current = firstCategory;
    }
  }, [allCategories]);

  // Center active tab when activeCategory changes (mobile only)
  useEffect(() => {
    if (activeCategory && mobileTabsRef.current) {
      setTimeout(() => {
        centerActiveTab(activeCategory);
      }, 100);
    }
  }, [activeCategory, centerActiveTab]);

  // Intersection Observer for smooth category highlighting
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
        const categoryName = mostVisibleEntry.target.getAttribute('data-category');
        if (categoryName && categoryName !== activeCategoryRef.current) {
          setActiveCategory(categoryName);
          activeCategoryRef.current = categoryName;
        }
      }
    }, observerOptions);

    // Observe all sections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [allCategories, isUserScrolling]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Smooth scroll to section
  const scrollToSection = useCallback((categoryName: string) => {
    const section = sectionRefs.current[categoryName];
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

  // Handle category button click - FIXED
  const handleCategoryClick = useCallback((categoryName: string) => {
    console.log('Category clicked:', categoryName);
    
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Disable intersection observer FIRST
    setIsUserScrolling(true);
    
    // Update active category immediately in ref AND state
    activeCategoryRef.current = categoryName;
    setActiveCategory(categoryName);
    
    // Use requestAnimationFrame to ensure state is updated before scroll
    requestAnimationFrame(() => {
      // Scroll to section
      scrollToSection(categoryName);
      
      // Re-enable intersection observer after scroll completes
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 1500);
    });
  }, [scrollToSection]);

  // Handle mobile tab click
  const handleMobileTabClick = useCallback((categoryName: string) => {
    console.log('Mobile category tab clicked:', categoryName);
    setActiveCategory(categoryName);
    
    // Center the active tab
    setTimeout(() => {
      centerActiveTab(categoryName);
    }, 100);
  }, [centerActiveTab]);

  // Render category icon
  const renderCategoryIcon = (category: any, isActive: boolean = false) => {
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
    } else if (category.icon) {
      return (
        <Image
          src={category.icon.asset.url}
          alt={category.name}
          width={20}
          height={20}
          className="object-contain"
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

  // If no categories found, show a message
  if (allCategories.length === 0) {
    return (
      <Section id="features" className="py-sm md:py-md lg:py-lg scroll-m-16 bg-gray-50">
        <Container className="flex flex-col items-center gap-16">
          <SectionHeader
            heading="Feature-Packed to Improve Every Front Office Workflow"
            description='Empower your team members with AI-powered calls, messages, and analytics across devices, to measure, analyze and optimize staff performance at every touch point in your practice'
          />
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Categories</h3>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No categorized features found.</p>
              <p className="text-sm text-gray-500">
                Features need to be properly assigned to categories in the CMS to display here.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="features" className="py-sm md:py-md lg:py-lg scroll-m-16 bg-gray-50">
      <Container className="flex flex-col items-center gap-16">
      <SectionHeader
            heading="Feature-Packed to Improve Every Front Office Workflow"
            description='Empower your team members with AI-powered calls, messages, and analytics across devices, to measure, analyze and optimize staff performance at every touch point in your practice'
        />

        {/* Desktop Layout - Two Column */}
        <div className="hidden lg:flex gap-16 w-full mt-[50px]">
            <aside className="w-80 flex-shrink-0">
              <div className="sticky top-24">
                <nav className="rounded-2xl" role="tablist" aria-label="Feature category navigation">
                  <div className="flex flex-col gap-[6px] mb-[24px]">
                    {allCategories.map((category, index) => {
                      const isActive = activeCategory === category.name;
                      return (
                        <motion.button
                          key={category.name}
                          ref={(el) => (categoryRefs.current[category.name] = el)}
                          onClick={() => handleCategoryClick(category.name)}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          aria-controls={`desktop-category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                          id={`desktop-tab-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className={`w-full flex items-center self-stretch transition-all duration-300 ${
                            isActive 
                              ? '  bg-white rounded-full' 
                              : ' rounded-xl bg-transparent'
                          }`}
                          style={{
                            gap: '16px',
                            padding: 'var(--spacing-2, 8px) var(--spacing-3, 12px)',
                          }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div 
                            className={`transition-colors duration-300 ${
                              isActive ? 'text-black' : 'text-gray-500'
                            }`}
                            aria-hidden="true"
                          >
                            {renderCategoryIcon(category, isActive)}
                          </div>
                          <span 
                            className={`text-lg font-normal transition-colors duration-300 font-geist leading-7 tracking-normal ${
                              isActive ? 'text-black' : 'text-gray-500'
                            }`}
                          >
                            {category.name}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                  <div className='flex flex-col gap-[20px] pt-[24px] border-t border-gray-200'>
                   <p className='block text-zinc-500 font-sans text-base font-normal leading-[150%] tracking-normal'>For Smarter Patient Call Management</p>
                    <div>
                  <Button type='primary' link="/demo">
                    <span>Book Free Demo</span>
                  </Button>
                  </div>
                  </div>
                </nav>
              </div>
            </aside>

            <main className="flex-1 space-y-16">
              {allCategories.map((category, index) => {
                const isActive = activeCategory === category.name;
                return (
                  <motion.article
                    key={category.name}
                    ref={(el) => (sectionRefs.current[category.name] = el)}
                    data-category={category.name}
                    id={`desktop-category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    role="tabpanel"
                    aria-labelledby={`desktop-tab-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="bg-white rounded-3xl shadow-lg overflow-hidden"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="p-3 space-y-8">
                      {/* Header Section - Title and Description with Image */}
                        <header className="relative flex flex-col justify-end items-start gap-2 flex-1 self-stretch" style={{
                          borderRadius: '12px',
                          background: 'linear-gradient(277deg, rgba(202, 197, 255, 0.20) 0%, rgba(202, 197, 255, 0.50) 49.61%, rgba(202, 197, 255, 0.10) 100.18%)',
                        }}>
                        <div className='flex flex-col lg:flex-row gap-4'>
                          <div className="w-full flex flex-col justify-end items-start gap-2 flex-1 self-stretch lg:w-1/2 px-8 p-12">
                            <h3 className="text-2xl font-bold text-gray-900 tracking-normal font-manrope leading-8" style={{
                              color: 'var(--Default-gray-900, #111827)'
                            }}>
                              {category.name}
                            </h3>
                            <p className="text-base font-normal text-gray-700 mt-2 font-geist leading-6 tracking-normal" style={{
                              color: 'var(--color-gray-700, #364153)'
                            }}>
                              {category.description}
                            </p>
                          </div>

                          <div className="w-full lg:w-1/2">
                            {category.mainImage && (
                              <figure className="relative">
                                <Image
                                  src={category.mainImage.asset.url}
                                  alt={`${category.name} feature illustration`}
                                  width={800}
                                  height={400}
                                  className="rounded-lg object-cover w-full h-full"
                                />
                              </figure>
                            ) }
                          </div>
                        </div>
                      </header>

                      {/* Features List Section */}
                      <section className="flex flex-col justify-end items-start self-stretch !mt-0 pt-6 px-6 pb-2.5" aria-label={`${category.name} features`}>
                        <h3 className="sr-only">Features included in {category.name}</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 w-full" role="list">
                          {category.features.map((feature, featureIndex) => {
                            const isLastItem = featureIndex === category.features.length - 1;
                            return (
                              <motion.li 
                                key={feature._id} 
                                className={`flex items-center gap-2 py-[14px] ${!isLastItem ? 'border-b border-gray-200' : ''}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                                role="listitem"
                              >
                              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                              <svg width="16" height="25" viewBox="0 0 16 25" fill="black" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M13.3633 7.52243C13.4261 7.57013 13.4789 7.62975 13.5187 7.69789C13.5584 7.76602 13.5844 7.84133 13.595 7.9195C13.6056 7.99767 13.6007 8.07717 13.5806 8.15345C13.5605 8.22973 13.5255 8.30128 13.4777 8.36403L7.07767 16.764C7.02576 16.8321 6.95989 16.8882 6.88449 16.9287C6.80908 16.9692 6.72589 16.9931 6.6405 16.9988C6.5551 17.0044 6.46948 16.9918 6.38937 16.9617C6.30927 16.9315 6.23654 16.8846 6.17607 16.824L2.57607 13.224C2.47009 13.1103 2.41239 12.9598 2.41513 12.8044C2.41788 12.649 2.48084 12.5007 2.59078 12.3907C2.70071 12.2808 2.84901 12.2178 3.00445 12.2151C3.1599 12.2123 3.31033 12.27 3.42407 12.376L6.53927 15.4904L12.5233 7.63683C12.6196 7.51039 12.7621 7.42733 12.9196 7.40588C13.0771 7.38443 13.2367 7.42635 13.3633 7.52243Z" fill="#030712"/>
                              </svg>
                              </div>
                              <span className="text-gray-950 font-geist text-base font-normal leading-6 tracking-normal transition-colors">
                                {feature.title}
                              </span>
                              </motion.li>
                            );
                          })}
                        </ul>
                      </section>
                    </div>
                  </motion.article>
                );
              })}
            </main>
          </div>

        {/* Mobile Layout - Horizontal Tabs + Content */}
        <section className="lg:hidden w-full max-w-7xl" aria-label="Feature Categories">
          {(() => {
            if (allCategories.length === 0) {
              return (
                <div className="text-center py-8" role="status" aria-live="polite">
                  <p className="text-gray-600">No categories available</p>
                </div>
              );
            }

            // Get the active category data
            const activeCategoryData = allCategories.find(cat => cat.name === activeCategory) || allCategories[0];
            const defaultCategory = allCategories[0];
            const displayCategory = activeCategory ? activeCategoryData : defaultCategory;

            return (
              <div className="space-y-6">
                {/* Horizontal Category Tabs */}
                <nav 
                  ref={mobileTabsRef} 
                  className="overflow-x-auto pb-2 scrollbar-none" 
                  role="tablist"
                  aria-label="Feature category navigation"
                >
                  <div className="flex space-x-3 min-w-max px-1">
                    {allCategories.map((category, index) => {
                      const isActive = activeCategory === category.name || (!activeCategory && index === 0);
                      
                      return (
                        <motion.button
                          key={category.name}
                          data-category={category.name}
                          onClick={() => handleMobileTabClick(category.name)}
                          role="tab"
                          aria-selected={isActive}
                          aria-controls={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                          id={`tab-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
                            isActive 
                              ? 'text-gray-900 shadow-sm' 
                              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                          }`}
                          style={{
                            backgroundColor: isActive ? 'rgba(21, 45, 24, 0.05)' : undefined
                          }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="flex items-center flex-col space-x-2">
                            <div className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center`} aria-hidden="true">
                              {renderCategoryIcon(category, isActive)}
                            </div>
                            <span className="text-[12px] font-medium whitespace-nowrap">
                              {category.name}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </nav>

                {/* Content Display Area */}
                <article
                  key={displayCategory?.name}
                  id={`category-${displayCategory?.name.toLowerCase().replace(/\s+/g, '-')}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${displayCategory?.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-0"
                  >
                    <header 
                      className="space-y-6"
                      style={{
                        background: 'linear-gradient(277deg, rgba(202, 197, 255, 0.20) 0%, rgba(202, 197, 255, 0.50) 49.61%, rgba(202, 197, 255, 0.10) 100.18%)',
                      }}
                    >
                      <div className="p-6 space-y-6">
                        <div className="text-start">
                          <h3 className="md:text-2xl text-xl font-bold text-gray-900 mb-2">
                            {displayCategory?.name}
                          </h3>
                        </div>

                        <div>
                          <p className="text-base text-gray-700 leading-relaxed text-start">
                            {displayCategory?.description}
                          </p>
                        </div>
                      </div>

                      {/* Image Section - No padding, full width */}
                      {displayCategory?.mainImage && (
                        <figure className="relative overflow-hidden">
                          <Image
                            src={displayCategory.mainImage.asset.url}
                            alt={`${displayCategory.name} feature illustration`}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover"
                          />
                        </figure>
                      )}
                    </header>

                    {/* Features List with White Background */}
                    <section className="p-6 bg-white" aria-label={`${displayCategory?.name} features`}>
                      <ul className="space-y-3" role="list">
                        {displayCategory?.features.map((feature, featureIndex) => {
                          const isLastItem = featureIndex === displayCategory.features.length - 1;
                          return (
                            <motion.li 
                              key={feature._id} 
                              className={`flex items-center space-x-3 py-[14px] ${!isLastItem ? 'border-b border-gray-200' : ''}`}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: featureIndex * 0.05 }}
                              role="listitem"
                            >
                              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                                <svg width="16" height="25" viewBox="0 0 16 25" fill="black" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M13.3633 7.52243C13.4261 7.57013 13.4789 7.62975 13.5187 7.69789C13.5584 7.76602 13.5844 7.84133 13.595 7.9195C13.6056 7.99767 13.6007 8.07717 13.5806 8.15345C13.5605 8.22973 13.5255 8.30128 13.4777 8.36403L7.07767 16.764C7.02576 16.8321 6.95989 16.8882 6.88449 16.9287C6.80908 16.9692 6.72589 16.9931 6.6405 16.9988C6.5551 17.0044 6.46948 16.9918 6.38937 16.9617C6.30927 16.9315 6.23654 16.8846 6.17607 16.824L2.57607 13.224C2.47009 13.1103 2.41239 12.9598 2.41513 12.8044C2.41788 12.649 2.48084 12.5007 2.59078 12.3907C2.70071 12.2808 2.84901 12.2178 3.00445 12.2151C3.1599 12.2123 3.31033 12.27 3.42407 12.376L6.53927 15.4904L12.5233 7.63683C12.6196 7.51039 12.7621 7.42733 12.9196 7.40588C13.0771 7.38443 13.2367 7.42635 13.3633 7.52243Z" fill="#030712"/>
                                </svg>
                              </div>
                              <span className="text-gray-700 font-medium">
                                {feature.title}
                              </span>
                            </motion.li>
                          );
                        })}
                      </ul>
                    </section>
                  </motion.div>
                </article>
              </div>
            );
          })()}
        </section>
        </Container>
      </Section>
    );
}