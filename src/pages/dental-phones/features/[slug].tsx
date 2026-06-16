import FeatureDetailPage from '~/components/features/FeatureDetailPage'
import {
  createFeatureStaticProps,
  featureStaticPaths,
  DENTAL_PHONES_LOCALES,
} from '~/lib/featurePage'

export default FeatureDetailPage

export const getStaticPaths = featureStaticPaths
export const getStaticProps = createFeatureStaticProps([...DENTAL_PHONES_LOCALES])
