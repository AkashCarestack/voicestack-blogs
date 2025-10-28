import { GetStaticProps, GetStaticPaths } from 'next';
import { getClient } from '~/lib/sanity.client';
import { getFeatureBySlug, getFeaturesList } from '~/lib/sanity.queries';
import Layout from '~/components/Layout';
import SimpleHead from '~/components/common/SimpleHead';
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
  secondaryImage?: any;
  overview?: any;
  description?: any;
  shortDescription?: any;
  featureCategories?: Array<{
    name: string;
    description?: string;
    icon?: any;
  }>;
  benefits?: Array<{
    title: string;
    description?: string;
    icon?: any;
  }>;
  pricing?: {
    isFree?: boolean;
    price?: string;
    billingPeriod?: string;
    trialAvailable?: boolean;
    trialPeriod?: string;
  };
  cta?: {
    primaryText?: string;
    primaryLink?: string;
    secondaryText?: string;
    secondaryLink?: string;
  };
  relatedFeatures?: Array<{
    _id: string;
    title: string;
    slug: {
      current: string;
    };
    heroImage?: any;
    shortDescription?: any;
  }>;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

interface FeaturePageProps {
  feature: Feature;
  otherFeatures: Feature[];
  currentLanguage: string;
}

export default function FeaturePage({ feature, otherFeatures, currentLanguage }: FeaturePageProps) {
  if (!feature) {
    return (
      <div>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Feature Not Found</h1>
          <p className="text-gray-600 mb-8">The feature you are looking for doesnt exist.</p>
          <Link
            href="/features"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Features
          </Link>
        </div>
      </div>
    );
  }

  const metaTitle = feature.metaTitle || feature.title;
  const metaDescription = feature.metaDescription || (typeof feature.overview === 'string' ? feature.overview : 'Feature description');

  return (
    <div>
      <SimpleHead
        title={metaTitle}
        description={metaDescription}
      />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {feature.heroTitle || feature.title}
                </h1>
                {feature.heroSubtitle && (
                  <p className="text-xl md:text-2xl mb-8 opacity-90">
                    {feature.heroSubtitle}
                  </p>
                )}
                {feature.cta && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    {feature.cta.primaryText && feature.cta.primaryLink && (
                      <Link
                        href={feature.cta.primaryLink}
                        className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                      >
                        {feature.cta.primaryText}
                      </Link>
                    )}
                    {feature.cta.secondaryText && feature.cta.secondaryLink && (
                      <Link
                        href={feature.cta.secondaryLink}
                        className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center"
                      >
                        {feature.cta.secondaryText}
                      </Link>
                    )}
                  </div>
                )}
              </div>
              
              {feature.heroImage && (
                <div className="relative h-96 lg:h-full">
                  <Image
                    src={feature.heroImage.asset.url}
                    alt={feature.title}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      {feature.overview && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Overview</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {typeof feature.overview === 'string' ? feature.overview : 'Feature overview'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Description Section */}
      {feature.description && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Feature</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {typeof feature.description === 'string' ? feature.description : 'Feature description'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories and Features */}
      {feature.featureCategories && feature.featureCategories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Feature Categories
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {feature.featureCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      {category.icon && (
                        <div className="w-12 h-12 mr-4 flex-shrink-0">
                          <Image
                            src={category.icon.asset.url}
                            alt={category.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-semibold text-gray-900">
                        {category.name}
                      </h3>
                    </div>
                    
                    {category.description && (
                      <p className="text-gray-600 mb-4">
                        {category.description}
                      </p>
                    )}
                    
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {feature.benefits && feature.benefits.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Key Benefits
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {feature.benefits.map((benefit, index) => (
                  <div key={index} className="text-center">
                    {benefit.icon && (
                      <div className="w-16 h-16 mx-auto mb-4">
                        <Image
                          src={benefit.icon.asset.url}
                          alt={benefit.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {benefit.title}
                    </h3>
                    {benefit.description && (
                      <p className="text-gray-600">
                        {benefit.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      {feature.pricing && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Pricing</h2>
              
              <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                {feature.pricing.isFree ? (
                  <div>
                    <div className="text-4xl font-bold text-green-600 mb-2">Free</div>
                    <p className="text-gray-600">This feature is included at no additional cost</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {feature.pricing.price}
                    </div>
                    <p className="text-gray-600 mb-4">
                      per {feature.pricing.billingPeriod}
                    </p>
                    {feature.pricing.trialAvailable && (
                      <p className="text-sm text-blue-600">
                        {feature.pricing.trialPeriod} free trial available
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Features Section */}
      {feature.relatedFeatures && feature.relatedFeatures.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Related Features
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {feature.relatedFeatures.slice(0, 3).map((relatedFeature) => (
                  <Link
                    key={relatedFeature._id}
                    href={`/features/${relatedFeature.slug.current}`}
                    className="group block bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {relatedFeature.heroImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedFeature.heroImage.asset.url}
                          alt={relatedFeature.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {relatedFeature.title}
                      </h3>
                      
                      {relatedFeature.shortDescription && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {typeof relatedFeature.shortDescription === 'string' ? relatedFeature.shortDescription : 'Feature description'}
                        </p>
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
              
              <div className="text-center mt-8">
                <Link
                  href="/features"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  View All Features
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
        const features = await getFeaturesList(getClient(), 'en'); // Get all features for path generation
    const paths = (features || []).map((feature: Feature) => ({
      params: { slug: feature.slug.current },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error generating feature paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  try {
    const slug = params?.slug as string;
    const currentLanguage = locale || 'en';
        const feature = await getFeatureBySlug(getClient(), slug, currentLanguage);
    
    if (!feature) {
      return {
        notFound: true,
      };
    }

    // Get other features (excluding current one)
        const allFeatures = await getFeaturesList(getClient(), currentLanguage);
    const otherFeatures = (allFeatures || []).filter((f: Feature) => f._id !== feature._id);

    return {
      props: {
        feature,
        otherFeatures: otherFeatures.slice(0, 3), // Limit to 3 other features
        currentLanguage,
      }
    };
  } catch (error) {
    console.error('Error fetching feature:', error);
    return {
      notFound: true,
    };
  }
};
