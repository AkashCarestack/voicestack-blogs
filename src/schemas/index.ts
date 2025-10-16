import { SchemaTypeDefinition } from 'sanity'

import banner from './banner'
import blockContent from './blockContent'
import BrowserList from './BrowserList'
import button from './button'
import CardsListing from './CardsListing/index'
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
import IntegrationListing from './IntegrationListing'
import featureSubSection from './featureSubSection'
import footer from './footer'
import GlobalData from './GlobalData'
import heroSubFeature from './heroSubFeature'
import HomeSettings from './HomeSettings/index'
import layout from './layout'
import legal from './Legal'
import ListingBlock from './ListingBlock'
import LogoListing from './LogoListing/index'
import Miscellaneous from './Miscellaneous'
import ListingAtom from './NestableBlocks/ListingAtom'
import page from './page'
import DentalSoftware from './Pages/DentalSoftware'
// import DentalSoftware from './Pages/DentalSoftware'
import FeaturesPage from './Pages/Features'
import WhoWeServe from './Pages/WhoWeServe'
import WhyVoicestack from './Pages/WhyVoicestack'
import DentalPhones from './Pages/DentalPhones'
import PlatformList from './PlatformList'
import Platforms from './Platforms/index'
import portableContent from './portableContent'
import SiteSettings from './SiteSettings'
import testimonialSection from './testimonial'
import TestimonialHighlight from './TestimonialHighlight'
import HtmlCode from './Utilis/HtmlCode'
import VerticalTestimonialListing from './VerticalTestimonialListing'


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
    CardsListing,
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
    ListingBlock,
    BrowserList,
    footer,
    banner,
    FeatureCategoryOld,
    FeatureCategoryNew,
    FeatureList,
    IntegrationCategory,
    IntegrationList,
    IntegrationListing,
    ListingAtom,
    portableContent,
    HtmlCode,
    WhoWeServe,
    DentalSoftware,
    FeaturesPage,
    WhyVoicestack,
    DentalPhones,
    GlobalData,
    VerticalTestimonialListing,
    button,
    faqRevamp,
  ],
}
