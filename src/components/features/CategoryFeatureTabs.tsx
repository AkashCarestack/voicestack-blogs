import React, { useState, useContext, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Button from '../common/Button';
import ButtonArrow from '../icons/ButtonArrow';
import { FormModal } from '../common/FormModal';
import { BookDemoContext } from '~/providers/BookDemoProvider';
import ImageLoader from '../common/imageLoader/imageLoader';

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
  const { isDemoPopUpShown } = useContext(BookDemoContext);
  const [openForm, setOpenForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Refs for intersection observer
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const categoryRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const activeCategoryRef = useRef<string>('');
  
  // Debug: Log incoming features data
  // console.log('CategoryFeatureTabs - Received features:', features.length, 'features');
  
  // Memoize the categories processing to prevent unnecessary re-renders
  const allCategories = useMemo(() => {
    const featuresByCategory = features.reduce((acc, feature) => {
      if (feature.featureCategory) {
        const category = feature.featureCategory;
        if (!acc[category.name]) {
          acc[category.name] = {
            category: category,
            features: []
          };
        }
        acc[category.name].features.push(feature);
      }
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

  // Set initial active category
  useEffect(() => {
    if (allCategories.length > 0) {
      const firstCategory = allCategories[0].name;
      setActiveCategory(firstCategory);
      activeCategoryRef.current = firstCategory;
    }
  }, [allCategories]);

  // Intersection Observer for smooth category highlighting - DISABLED for now
  // useEffect(() => {
  //   const observerOptions = {
  //     root: null,
  //     rootMargin: '-120px 0px -60% 0px', // Account for header height (100px + 20px buffer)
  //     threshold: 0.3
  //   };

  //   const observer = new IntersectionObserver((entries) => {
  //     // Only update if not scrolling and user hasn't manually clicked
  //     if (isScrolling || userClicked) return;
      
  //     // Find the entry with the highest intersection ratio
  //     let mostVisibleEntry = null;
  //     let highestRatio = 0;
      
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
  //         highestRatio = entry.intersectionRatio;
  //         mostVisibleEntry = entry;
  //       }
  //     });
      
  //     if (mostVisibleEntry && highestRatio > 0.5) { // Only update if significantly visible
  //       const categoryName = mostVisibleEntry.target.getAttribute('data-category');
  //       if (categoryName && categoryName !== activeCategory) {
  //         setActiveCategory(categoryName);
  //       }
  //     }
  //   }, observerOptions);

  //   // Observe all sections
  //   Object.values(sectionRefs.current).forEach((ref) => {
  //     if (ref) observer.observe(ref);
  //   });

  //   return () => observer.disconnect();
  // }, [allCategories, isScrolling, userClicked, activeCategory]);

  // Smooth scroll to section
  const scrollToSection = (categoryName: string) => {
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
  };

  // Render category icon
  const renderCategoryIcon = (category: any) => {
    if (category.iconSvgCode) {
      return (
        <div 
          className="w-4 h-4 flex items-center justify-center"
          dangerouslySetInnerHTML={{
            __html: category.iconSvgCode
              .replace(/fill="[^"]*"/g, 'fill="currentColor"')
              .replace(/stroke="[^"]*"/g, 'stroke="currentColor"')
              .replace(/fill='[^']*'/g, "fill='currentColor'")
              .replace(/stroke='[^']*'/g, "stroke='currentColor'")
          }}
        />
      );
    } else if (category.icon) {
      return (
        <Image
          src={category.icon.asset.url}
          alt={category.name}
          width={16}
          height={16}
          className="object-contain"
        />
      );
    } else {
      return (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 text-sm">📋</span>
        </div>
      );
    }
  };

  // If no categories found, show a message
  if (allCategories.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Powerful Packed With Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No feature categories found.</p>
                  <p className="text-sm text-gray-500">
                    Features need to be assigned to categories to display here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Powerful Packed With Features
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </motion.p>
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button type='primary' onClick={() => setOpenForm(true)}>
                <ButtonArrow />
                <span>Book Free Demo</span>
              </Button>
            </motion.div>
          </div>

          {/* Desktop Layout - Two Column */}
          <div className="hidden lg:flex gap-12">
            {/* Left Sidebar - Sticky Category Navigation */}
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-24">
                <div className="rounded-2xl">
                  <div className="">
                    {allCategories.map((category, index) => {
                      const isActive = activeCategory === category.name || activeCategoryRef.current === category.name;
                      
                      return (
                        <motion.button
                          key={category.name}
                          ref={(el) => (categoryRefs.current[category.name] = el)}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveCategory(category.name);
                            activeCategoryRef.current = category.name;
                            setForceUpdate(prev => prev + 1);
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveCategory(category.name);
                            activeCategoryRef.current = category.name;
                            setForceUpdate(prev => prev + 1);
                            scrollToSection(category.name);
                          }}
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
       
                        >
                          <div 
                            className={`text-2xl transition-colors duration-300 ${
                              isActive ? '!text-gray-950' : 'text-gray-500'
                            }`}
                          >
                            {renderCategoryIcon(category)}
                          </div>
                          <span 
                            className={`text-lg font-medium transition-colors duration-300 font-geist leading-7 tracking-normal ${
                              isActive ? '!text-gray-950' : 'text-gray-500'
                            }`}
                            style={{
                              color: 'var(--color-gray-500, #6A7282)'
                            }}
                          >
                            {category.name}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Scrollable Sections */}
            <div className="flex-1 space-y-16">
              {allCategories.map((category, index) => {
                const isActive = activeCategory === category.name;
                
                return (
                  <motion.div
                    key={category.name}
                    ref={(el) => (sectionRefs.current[category.name] = el)}
                    data-category={category.name}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="p-3 space-y-8">
                      {/* Header Section - Title and Description with Image */}
                        <div className="relative flex flex-col justify-end items-start gap-2 flex-1 self-stretch" style={{
                          borderRadius: '12px',
                          background: 'linear-gradient(277deg, rgba(202, 197, 255, 0.20) 0%, rgba(202, 197, 255, 0.50) 49.61%, rgba(202, 197, 255, 0.10) 100.18%)',
                        }}>
                        <div className='flex flex-col lg:flex-row gap-4'>
                          <div className="w-full flex flex-col justify-end items-start gap-2 flex-1 self-stretch lg:w-1/2 !pt-12 p-8">
                            <span className="text-2xl font-bold text-gray-900 uppercase tracking-normal font-manrope leading-8" style={{
                              color: 'var(--Default-gray-900, #111827)'
                            }}>
                              {category.name.toUpperCase()}
                            </span>
                            <h3 className="text-base font-normal text-gray-700 mt-2 mb-4 font-geist leading-6 tracking-normal" style={{
                              color: 'var(--color-gray-700, #364153)'
                            }}>
                              {category.description}
                            </h3>
                          </div>

                          {/* Image Section */}
                          <div className="w-full lg:w-1/2">
                            {category.mainImage && (
                              <div className="relative">
                                <Image
                                  src={category.mainImage.asset.url}
                                  alt={category.name}
                                  width={800}
                                  height={400}
                                  className="rounded-lg object-cover w-full h-full"
                                />
                              </div>
                            ) }
                          </div>
                        </div>
                      </div>

                      {/* Features List Section */}
                      <div className="flex flex-col justify-end items-start self-stretch !mt-0 pt-6 px-6 pb-2.5">
                      
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {category.features.map((feature, featureIndex) => (
                            <motion.div 
                              key={feature._id} 
                              className="flex items-center space-x-3"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                            >
                              <div className="w-5 h-5  rounded-full flex items-center justify-center flex-shrink-0">
                              <svg width="16" height="25" viewBox="0 0 16 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M13.3633 7.52243C13.4261 7.57013 13.4789 7.62975 13.5187 7.69789C13.5584 7.76602 13.5844 7.84133 13.595 7.9195C13.6056 7.99767 13.6007 8.07717 13.5806 8.15345C13.5605 8.22973 13.5255 8.30128 13.4777 8.36403L7.07767 16.764C7.02576 16.8321 6.95989 16.8882 6.88449 16.9287C6.80908 16.9692 6.72589 16.9931 6.6405 16.9988C6.5551 17.0044 6.46948 16.9918 6.38937 16.9617C6.30927 16.9315 6.23654 16.8846 6.17607 16.824L2.57607 13.224C2.47009 13.1103 2.41239 12.9598 2.41513 12.8044C2.41788 12.649 2.48084 12.5007 2.59078 12.3907C2.70071 12.2808 2.84901 12.2178 3.00445 12.2151C3.1599 12.2123 3.31033 12.27 3.42407 12.376L6.53927 15.4904L12.5233 7.63683C12.6196 7.51039 12.7621 7.42733 12.9196 7.40588C13.0771 7.38443 13.2367 7.42635 13.3633 7.52243Z" fill="#030712"/>
</svg>

                              </div>
                              <Link 
                                href={`/features/${feature.slug.current}`}
                                className="text-gray-700 hover:text-purple-600 transition-colors"
                              >
                                {feature.title}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
 
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile Layout - Accordion */}
          <div className="lg:hidden space-y-4">
            {allCategories.map((category, index) => {
              const isActive = activeCategory === category.name;
              
              return (
                <motion.div
                  key={category.name}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {/* Accordion Header */}
                  <motion.button
                    onClick={() => setActiveCategory(isActive ? '' : category.name)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div 
                        className={`text-2xl transition-colors duration-300 ${
                          isActive ? 'text-purple-600' : 'text-gray-600'
                        }`}
                      >
                        {renderCategoryIcon(category)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {category.features.length} features
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isActive ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-400"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </motion.button>

                  {/* Accordion Content */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 border-t border-gray-100 space-y-6">
                          {/* Header Section - Title and Description */}
                          <div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-2 font-manrope leading-8 tracking-normal" style={{
                              color: 'var(--Default-gray-900, #111827)'
                            }}>
                              {category.description}
                            </h4>
                            {category.subheading && (
                              <h5 className="text-base font-normal text-gray-700 mb-2 font-geist leading-6 tracking-normal" style={{
                                color: 'var(--color-gray-700, #364153)'
                              }}>
                                {category.subheading}
                              </h5>
                            )}
                            <p className="text-base font-normal text-gray-600 font-geist leading-6 tracking-normal" style={{
                              color: 'var(--color-gray-700, #364153)'
                            }}>
                              {category.description || 'Enhance patient experience with AI call scoring, analytics, and automation to improve communication and processes.'}
                            </p>
                          </div>

                          {/* Image Section */}
                          <div className="relative p-6" style={{
                            borderRadius: '12px',
                            background: 'linear-gradient(277deg, rgba(202, 197, 255, 0.20) 0%, rgba(202, 197, 255, 0.50) 49.61%, rgba(202, 197, 255, 0.10) 100.18%)'
                          }}>
                            {category.mainImage ? (
                              <div className="relative">
                                <Image
                                  src={category.mainImage.asset.url}
                                  alt={category.name}
                                  width={400}
                                  height={300}
                                  className="rounded-lg object-cover w-full h-60"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-60 bg-white/10 rounded-lg backdrop-blur-sm">
                                <div className="text-center text-white">
                                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <p className="text-sm">No image available</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Features List Section */}
                          <div>
                            <h5 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h5>
                            <div className="w-12 h-1 bg-pink-400 rounded-full mb-3"></div>
                            <div className="grid grid-cols-1 gap-2">
                              {category.features.map((feature, featureIndex) => (
                                <motion.div 
                                  key={feature._id} 
                                  className="flex items-center space-x-3"
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: featureIndex * 0.1 }}
                                >
                                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <Link 
                                    href={`/features/${feature.slug.current}`}
                                    className="text-gray-700 hover:text-purple-600 transition-colors text-sm"
                                  >
                                    {feature.title}
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button type='primary' onClick={() => setOpenForm(true)} className="w-full sm:w-auto">
                              <ButtonArrow />
                              <span>Book Free Demo</span>
                            </Button>
                            <Button type='secondary' onClick={() => {}} className="w-full sm:w-auto">
                              <span>Learn More</span>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      
      {openForm && (
        <FormModal
          className={`pt-9 flex items-start`}
          onClose={() => setOpenForm(false)}
          data={isDemoPopUpShown}
        />
      )}
    </div>
  );
}
