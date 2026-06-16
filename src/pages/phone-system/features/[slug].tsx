import FeatureDetailPage from '~/components/features/FeatureDetailPage'
import {
  createFeatureStaticProps,
  featureStaticPaths,
  PHONE_SYSTEM_LOCALES,
} from '~/lib/featurePage'

export default FeatureDetailPage

export const getStaticPaths = featureStaticPaths
export const getStaticProps = createFeatureStaticProps([...PHONE_SYSTEM_LOCALES])
