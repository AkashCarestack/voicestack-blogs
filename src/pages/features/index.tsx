import { GetStaticProps } from 'next';
import { getClient } from '~/lib/sanity.client';
import { getFeaturesList } from '~/lib/sanity.queries';
import Layout from '~/components/Layout';
import SimpleHead from '~/components/common/SimpleHead';
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs';

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
    description?: string;
    icon?: any;
  };
}

interface FeaturesPageProps {
  features: Feature[];
  currentLanguage: string;
  landingPage?: Feature | null;
}

export default function FeaturesPage({ features, currentLanguage, landingPage }: FeaturesPageProps) {
  return (
    <div>
      <SimpleHead
        title="Features - VoiceStack"
        description="Discover all the powerful features that make VoiceStack the leading dental practice management solution."
      />
      <div>
      {landingPage && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                {landingPage.title}
              </h2>
              {landingPage.heroSubtitle && (
                <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                  {landingPage.heroSubtitle}
                </p>
              )}
              {landingPage.shortDescription && (
                <p className="text-lg text-gray-600 text-center mb-12 max-w-4xl mx-auto">
                  {typeof landingPage.shortDescription === 'string' ? landingPage.shortDescription : 'Feature description'}
                </p>
              )}
            </div>
          </div>
        </section>
      )}
      <CategoryFeatureTabs features={features.filter(feature => feature.slug?.current !== 'landing')} />
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const currentLanguage = locale || 'en';
    const features = await getFeaturesList(getClient(), currentLanguage);
    const landingPage = features.find((feature: Feature) => feature.slug?.current === 'landing');
    
    return {
      props: {
        features: features || [],
        currentLanguage,
        landingPage: landingPage || null,
      },
    };
  } catch (error) {
    console.error('Error fetching features:', error);
    return {
      props: {
        features: [],
        currentLanguage: locale || 'en',
        landingPage: null,
      },
      revalidate: 60,
    };
  }
};
