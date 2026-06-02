import FeatureHero, { FeatureHeroProps } from './FeatureHero'

export default function LpHero(props: FeatureHeroProps) {
  return <FeatureHero {...props} mangoLayout={props.mangoLayout ?? true} />
}
