import { SchemaTypeDefinition } from 'sanity'

import banner from './banner'
import blockContent from './blockContent'
import button from './button'
import comparison from './Comparison'
import comparisonValue from "./ComparisonValue"
import CsCardsListing from './CsCardsListing/index'
import customBlockContent from './customBlockContent'
import customContent from './customContent'
import DynamicComponent from './DynamicComponent'
import faq from './faq'
import faqRevamp from './faqRevamp'
import Testimonials from './Feature'
import feature from './Feature'
import FeatureCategory from './FeatureCategory'
import FeatureCategoryNew from './FeatureCategory/featureCategoryNew'
import FeatureCategoryOld from './FeatureCategory/index'
import FeatureList from './FeatureList'
import Features from './Features'
import IntegrationCategory from './IntegrationCategory'
import IntegrationList from './IntegrationList'
import featureSubSection from './featureSubSection'
import footer from './footer'
import GlobalData from './GlobalData'
import heroSubFeature from './heroSubFeature'
import HomeSettings from './HomeSettings/index'
import layout from './layout'
import legal from './Legal'
import LogoListing from './LogoListing/index'
import Miscellaneous from './Miscellaneous'
import page from './page'
import DentalSoftware from './Pages/DentalSoftware'
// import DentalSoftware from './Pages/DentalSoftware'
import FeaturesPage from './Pages/Features'
import WhoWeServe from './Pages/WhoWeServe'
import WhyVoicestack from './Pages/WhyVoicestack'
import DentalPhones from './Pages/DentalPhones'
import AiReceptionist from './Pages/AiReceptionist'
import FeaturePage from './Pages/FeaturePage'
import CompanyPage from './Pages/CompanyPage'
import PlatformList from './PlatformList'
import Platforms from './Platforms/index'
import portableContent from './portableContent'
import SiteSettings from './SiteSettings'
import testimonialSection from './testimonial'
import TestimonialHighlight from './TestimonialHighlight'
import HtmlCode from './Utilis/HtmlCode'
import VerticalTestimonialListing from './VerticalTestimonialListing'
import WhoWeServeListing from './WhoWeServeListing'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContent,
    layout,
    Features,
    heroSubFeature,
    SiteSettings,
    Testimonials,
    HomeSettings,
    legal,
    comparison,
    comparisonValue,
    Platforms,
    PlatformList,
    LogoListing,
    CsCardsListing,
    featureSubSection,
    testimonialSection,
    faq,
    customBlockContent,
    TestimonialHighlight,
    Miscellaneous,
    page,
    ...DynamicComponent,
    customContent,
    footer,
    banner,
    FeatureCategoryOld,
    FeatureCategoryNew,
    FeatureList,
    IntegrationCategory,
    IntegrationList,
    portableContent,
    HtmlCode,
    WhoWeServe,
    DentalSoftware,
    FeaturesPage,
    WhyVoicestack,
    DentalPhones,
    AiReceptionist,
    FeaturePage,
    CompanyPage,
    GlobalData,
    VerticalTestimonialListing,
    WhoWeServeListing,
    button,
    faqRevamp,
  ],
}
