import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
    description?: string;
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

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              VoiceStack provides a platform for all dental functions without upsells.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Categories */}
            <div className="lg:w-1/3">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Feature Categories
                </h3>
                <nav className="space-y-2">
                  {categories?.map((categoryName) => {
                    const categoryData = featuresByCategory[categoryName];
                    const isActive = activeCategory === categoryName;
                    
                    return (
                      <button
                        key={categoryName}
                        onClick={() => setActiveCategory(categoryName)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {categoryData.category.icon && (
                              <div className="w-5 h-5 flex-shrink-0">
                                <Image
                                  src={categoryData.category.icon.asset.url}
                                  alt={categoryName}
                                  width={20}
                                  height={20}
                                  className="object-contain"
                                />
                              </div>
                            )}
                            <span className="font-medium">{categoryName}</span>
                          </div>
                          <span className={`text-sm ${
                            isActive ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            ({categoryData.features.length})
                          </span>
                        </div>
                        {categoryData.category.description && (
                          <p className={`text-sm mt-1 ${
                            isActive ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {categoryData.category.description}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            <div className="lg:w-2/3">
              {activeCategory && featuresByCategory[activeCategory] ? (
                <div className="space-y-6">
                  {/* Category Header */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 shadow-sm">
                    {/* Category Label */}
                    <div className="mb-4">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {activeCategory}
                      </span>
                    </div>

                    {/* Category Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {featuresByCategory[activeCategory].category.description || activeCategory}
                    </h3>

                    {/* Category Description */}
                    {featuresByCategory[activeCategory].category.description && (
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {featuresByCategory[activeCategory].category.description}
                      </p>
                    )}

                    {/* Features List */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-3">Features in this Category</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activeFeatures.map((feature) => (
                          <Link
                            key={feature._id}
                            href={`/features/${feature.slug.current}`}
                            className="flex items-center justify-between text-white hover:text-blue-300 transition-colors"
                          >
                            <span className="truncate">{feature.title}</span>
                            <svg className="w-4 h-4 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No features found</h3>
                  <p className="text-gray-500">No features available in this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
