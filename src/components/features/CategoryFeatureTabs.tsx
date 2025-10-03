import React, { useState, useContext, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Button from '../common/Button';
import ButtonArrow from '../icons/ButtonArrow';
import { FormModal } from '../common/FormModal';
import { BookDemoContext } from '~/providers/BookDemoProvider';

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
  const [activeCategory, setActiveCategory] = useState('');
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Refs for intersection observer
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const categoryRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  
  // Debug: Log incoming features data
  console.log('CategoryFeatureTabs - Received features:', features.length, 'features');
  
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

  const categories = Object.keys(featuresByCategory);
  
  
  // Get all unique categories from the features data
  const allCategories = Object.keys(featuresByCategory).map(categoryName => {
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

  // Set initial active category
  useEffect(() => {
    if (allCategories.length > 0 && !activeCategory) {
      setActiveCategory(allCategories[0].name);
    }
  }, [allCategories, activeCategory]);

  // Intersection Observer for smooth category highlighting
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-120px 0px -60% 0px', // Account for header height (100px + 20px buffer)
      threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const categoryName = entry.target.getAttribute('data-category');
          if (categoryName && !isScrolling) {
            setActiveCategory(categoryName);
          }
        }
      });
    }, observerOptions);

    // Observe all sections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [allCategories, isScrolling]);

  // Smooth scroll to section
  const scrollToSection = (categoryName: string) => {
    setIsScrolling(true);
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
    setTimeout(() => setIsScrolling(false), 1000);
  };

  // Render category icon
  const renderCategoryIcon = (category: any) => {
    if (category.iconSvgCode) {
      return (
        <div 
          className="w-8 h-8 flex items-center justify-center"
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
          width={32}
          height={32}
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
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Categories</h3>
                  <div className="space-y-2">
                    {allCategories.map((category, index) => {
                      const isActive = activeCategory === category.name;
                      
                      return (
                        <motion.button
                          key={category.name}
                          ref={(el) => (categoryRefs.current[category.name] = el)}
                          onClick={() => scrollToSection(category.name)}
                          className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                            isActive 
                              ? 'bg-purple-50 border-2 border-purple-200' 
                              : 'hover:bg-gray-50 border-2 border-transparent'
                          }`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div 
                            className={`text-2xl transition-colors duration-300 ${
                              isActive ? 'text-purple-600' : 'text-gray-600'
                            }`}
                          >
                            {renderCategoryIcon(category)}
                          </div>
                          <span 
                            className={`text-sm font-medium transition-colors duration-300 ${
                              isActive ? 'text-purple-600' : 'text-gray-700'
                            }`}
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      {/* Left Visual Demo */}
                      <div className="relative p-8 bg-gradient-to-br from-purple-500 to-blue-600">
                        {category.mainImage ? (
                          <div className="relative">
                            <Image
                              src={category.mainImage.asset.url}
                              alt={category.name}
                              width={500}
                              height={400}
                              className="rounded-lg object-cover w-full h-80"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-80 bg-white/10 rounded-lg backdrop-blur-sm">
                            <div className="text-center text-white">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <p className="text-sm">No image available</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Content */}
                      <div className="p-8 space-y-6">
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {category.name.toUpperCase()}
                          </span>
                          <h3 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                            {category.description}
                          </h3>
                          {category.subheading && (
                            <h4 className="text-xl font-semibold text-gray-700 mb-4">
                              {category.subheading}
                            </h4>
                          )}
                          <p className="text-lg text-gray-600 leading-relaxed">
                            {category.description || 'Enhance patient experience with AI call scoring, analytics, and automation to improve communication and processes.'}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Features Included</h4>
                          <div className="flex items-center mb-4">
                            <div className="w-16 h-1 bg-pink-400 rounded-full"></div>
                          </div>
                          <ul className="space-y-3">
                            {category.features.map((feature, featureIndex) => (
                              <motion.li 
                                key={feature._id} 
                                className="flex items-center space-x-3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                              >
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <Link 
                                  href={`/features/${feature.slug.current}`}
                                  className="text-gray-700 hover:text-purple-600 transition-colors"
                                >
                                  {feature.title}
                                </Link>
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex space-x-4">
                          <Button type='primary' onClick={() => setOpenForm(true)}>
                            <ButtonArrow />
                            <span>Book Free Demo</span>
                          </Button>
                          <Button type='secondary' onClick={() => {}}>
                            <span>Learn More</span>
                          </Button>
                        </div>
                      </div>
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
                        <div className="p-6 border-t border-gray-100">
                          {/* Visual Demo */}
                          <div className="relative mb-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-6">
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

                          {/* Content */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 mb-2">
                                {category.description}
                              </h4>
                              {category.subheading && (
                                <h5 className="text-lg font-semibold text-gray-700 mb-2">
                                  {category.subheading}
                                </h5>
                              )}
                              <p className="text-gray-600">
                                {category.description || 'Enhance patient experience with AI call scoring, analytics, and automation to improve communication and processes.'}
                              </p>
                            </div>

                            <div>
                              <h5 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h5>
                              <div className="w-12 h-1 bg-pink-400 rounded-full mb-3"></div>
                              <ul className="space-y-2">
                                {category.features.map((feature, featureIndex) => (
                                  <motion.li 
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
                                  </motion.li>
                                ))}
                              </ul>
                            </div>

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
