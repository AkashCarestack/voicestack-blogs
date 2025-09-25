import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
  featureCategories?: Array<{
    name: string;
    subheading?: string;
    description?: string;
    mainImage?: any;
    icon?: any;
  }>;
}

interface CategoryFeatureTabsProps {
  features: Feature[];
}

export default function CategoryFeatureTabs({ features }: CategoryFeatureTabsProps) {
  const featuresByCategory = features.reduce((acc, feature) => {
    if (feature.featureCategories && feature.featureCategories.length > 0) {
      feature.featureCategories.forEach(category => {
        if (!acc[category.name]) {
          acc[category.name] = {
            category: category,
            features: []
          };
        }
        acc[category.name].features.push(feature);
      });
    } else {
      if (!acc['Other']) {
        acc['Other'] = {
          category: { name: 'Other', description: 'Features without specific categories' },
          features: []
        };
      }
      acc['Other'].features.push(feature);
    }
    return acc;
  }, {} as Record<string, { category: any; features: Feature[] }>);

  const categories = Object.keys(featuresByCategory);
  const [activeCategory, setActiveCategory] = useState(categories[0] || '');

  const activeFeatures = featuresByCategory[activeCategory]?.features || [];

  // Get all unique categories from the features data
  const allCategories = Object.keys(featuresByCategory).map(categoryName => {
    const categoryData = featuresByCategory[categoryName];
    return {
      name: categoryName,
      subheading: categoryData.category.subheading,
      description: categoryData.category.description || categoryName,
      mainImage: categoryData.category.mainImage,
      icon: categoryData.category.icon,
      features: categoryData.features
    };
  });

  const activeFeatureData = allCategories.find(cat => cat.name === activeCategory) || allCategories[0];

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Packed With Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          {/* Horizontal Feature Tabs */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {allCategories.map((category, index) => {
              const isActive = activeCategory === category.name;
              return (
                <motion.button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`flex flex-col items-center p-4 rounded-lg transition-all duration-300 min-w-[120px] ${
                    isActive
                      ? 'bg-white border-2 border-purple-500 shadow-lg'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div 
                    className={`text-2xl mb-2 ${
                      isActive ? 'text-purple-600' : 'text-gray-600'
                    }`}
                    animate={{ 
                      scale: isActive ? 1.1 : 1,
                      rotate: isActive ? 5 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {category.icon ? (
                      <Image
                        src={category.icon.asset.url}
                        alt={category.name}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm">📋</span>
                      </div>
                    )}
                  </motion.div>
                  <motion.span 
                    className={`text-sm font-medium ${
                      isActive ? 'text-purple-600' : 'text-gray-700'
                    }`}
                    animate={{ 
                      color: isActive ? '#9333ea' : '#374151'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {category.name}
                  </motion.span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Content Section */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Left Visual Demo */}
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-8 shadow-2xl">
                  {activeFeatureData.mainImage ? (
                    <div className="relative">
                      <Image
                        src={activeFeatureData.mainImage.asset.url}
                        alt={activeFeatureData.name}
                        width={500}
                        height={400}
                        className="rounded-lg object-cover w-full h-80"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-80 bg-gray-100 rounded-lg">
                      <div className="text-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-sm">No image available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Content */}
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {activeFeatureData.name.toUpperCase()}
                  </span>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                    {activeFeatureData.description}
                  </h3>
                  {activeFeatureData.subheading && (
                    <h4 className="text-xl font-semibold text-gray-700 mb-4">
                      {activeFeatureData.subheading}
                    </h4>
                  )}
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {activeFeatureData.description || 'Enhance patient experience with AI call scoring, analytics, and automation to improve communication and processes.'}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Features Included</h4>
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-1 bg-pink-400 rounded-full"></div>
                  </div>
                  <ul className="space-y-3">
                    {activeFeatures.map((feature, index) => (
                      <li key={feature._id} className="flex items-center space-x-3">
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
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <motion.button 
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Book Free Demo
                  </motion.button>
                  <motion.button 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
