import { GetStaticProps } from 'next';
import { getClient } from '~/lib/sanity.client';
import { getFeaturesList } from '~/lib/sanity.queries';
import Layout from '~/components/Layout';
import SimpleHead from '~/components/common/SimpleHead';
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs';
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection';
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial';

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
  // Transform landingPage data to match HeroSection expected format
  const heroData = landingPage ? {
    heroheading: landingPage.heroTitle 
      ? [{ 
          _type: 'block', 
          children: [{ _type: 'span', text: landingPage.heroTitle }],
          style: 'normal'
        }] 
      : landingPage.title
        ? [{ 
            _type: 'block', 
            children: [{ _type: 'span', text: landingPage.title }],
            style: 'normal'
          }]
        : undefined,
    heroDescription: (landingPage.heroSubtitle || landingPage.shortDescription)
      ? [{ 
          _type: 'block', 
          children: [{ _type: 'span', text: typeof (landingPage.heroSubtitle || landingPage.shortDescription) === 'string' 
            ? (landingPage.heroSubtitle || landingPage.shortDescription || '')
            : String(landingPage.heroSubtitle || landingPage.shortDescription || '') }],
          style: 'normal'
        }]
      : undefined,
    heroImage: landingPage.heroImage,
    mainImage: landingPage.mainImage || landingPage.heroImage,
  } : null;

  return (
    <div>
      <SimpleHead
        title="Features - VoiceStack"
        description="Discover all the powerful features that make VoiceStack the leading dental practice management solution."
      />
      <div>
        {landingPage && heroData && (
          <div
            className="bg-gradient-to-r from-[#CAC5FF] via-[#F2F1FA] to-[#F0EFFA]"
            style={{
              background: 'linear-gradient(270deg, #CAC5FF 0%, #F2F1FA 51.44%, #F0EFFA 100%)'
            }}
          >
            <HeroSection
              page=""
              data={heroData}
            />
          </div>
        )}
        {/* {pageData['stack-card-tab-testimonial']?.componentData && (
        <StackCardTestimonial
          data={pageData['stack-card-tab-testimonial']?.componentData}
        />
      )} */}
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
    };
  }
};
