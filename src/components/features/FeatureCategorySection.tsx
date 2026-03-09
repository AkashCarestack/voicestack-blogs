import React from 'react'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'

interface FeatureCategorySectionProps {
  data: any
}

export default function FeatureCategorySection({ data }: FeatureCategorySectionProps) {
  if (!data || !data.componentData) {
    return null
  }

  const componentData = data.componentData
  const heading = componentData?.heading
  const description = componentData?.description

  return (
    <Section>
      <Container>
        {heading && <h2>{heading}</h2>}
        {description && <p>{description}</p>}
      </Container>
    </Section>
  )
}
