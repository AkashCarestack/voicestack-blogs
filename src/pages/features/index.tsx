import { GetStaticProps } from 'next';
import { getClient } from '~/lib/sanity.client';
import { getFeaturesList } from '~/lib/sanity.queries';
import Layout from '~/components/Layout';
import SimpleHead from '~/components/common/SimpleHead';
import Link from 'next/link';
import Image from 'next/image';

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
    features?: Array<{
      title: string;
      description?: string;
      icon?: string;
      isHighlighted?: boolean;
    }>;
  }>;
}

interface FeaturesPageProps {
  features: Feature[];
  currentLanguage: string;
}

export default function FeaturesPage({ features, currentLanguage }: FeaturesPageProps) {
  return (
    <Layout>
      <SimpleHead
        title="Features - VoiceStack"
        description="Discover all the powerful features that make VoiceStack the leading dental practice management solution."
      />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for Your Dental Practice
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover how our comprehensive suite of features can transform your dental practice management
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Explore Our Features
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Each feature is designed to streamline your workflow and enhance patient care
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Link
                  key={feature._id}
                  href={`/features/${feature.slug.current}`}
                  className="group block bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {feature.heroImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={feature.heroImage.asset.url}
                        alt={feature.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    
                    {feature.heroSubtitle && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {feature.heroSubtitle}
                      </p>
                    )}

                    {feature.shortDescription && (
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {typeof feature.shortDescription === 'string' ? feature.shortDescription : 'Feature description'}
                      </p>
                    )}

                    {feature.featureCategories && feature.featureCategories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {feature.featureCategories.slice(0, 3).map((category, index) => (
                          <span
                            key={index}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {category.name}
                          </span>
                        ))}
                        {feature.featureCategories.length > 3 && (
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            +{feature.featureCategories.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                      Learn More
                      <svg
                        className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {features.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No features found</h3>
                <p className="text-gray-500">Check back later for new features.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const currentLanguage = locale || 'en';
        const features = await getFeaturesList(getClient(), currentLanguage);
    
    return {
      props: {
        features: features || [],
        currentLanguage,
      },
      revalidate: 60, // Revalidate every minute
    };
  } catch (error) {
    console.error('Error fetching features:', error);
    return {
      props: {
        features: [],
        currentLanguage: locale || 'en',
      },
      revalidate: 60,
    };
  }
};
