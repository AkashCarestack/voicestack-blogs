import { GetStaticProps } from 'next'

import Button from '~/components/common/Button'
import MailIcon from '~/components/icons/MailIcon'
import PhoneIcon from '~/components/icons/PhoneIcon'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import SectionHeader from '~/components/revamp/components/common/sectionHeader'
import Queries from '~/components/revamp/queries'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'

export default function ContactPage({ heroSectionData }) {
  console.log(heroSectionData, 'heroSectionData in contact page')
  return (
    <>
      <div
        className="pt-lg pb-md"
        style={{
          background:
            'linear-gradient(270deg, #CAC5FF 0%, #F2F1FA 51.44%, #F0EFFA 100%)',
        }}
      >
        <Section>
          <Container className="flex flex-col items-center gap-16">
            <SectionHeader
              heading="Contact Us"
              description="If you have an immediate question or are in need of assistance, please find support using your preferred method. Dedicated customer support teams are available to provide chat, email, and phone assistance."
            />
            <div className="flex gap-4">
              <Button
                type="secondary"
                className="w-fit"
                link={'mailto:support@voicestack.com'}
              >
                <MailIcon />
                <span>support@voicestack.com</span>
              </Button>
              <Button
                type="secondary"
                className="w-fit"
                link={'tel:+14078336436'}
              >
                <PhoneIcon />
                <span>(407) 833-6436</span>
              </Button>
            </div>
          </Container>
        </Section>
      </div>
    </>
  )
}
export const getStaticProps: GetStaticProps<any> = async ({
  locale,
  draftMode = process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? true : false,
}) => {
  const region = locale || 'en'

  // revamp queries
  const queries = new Queries('home', region)

  const heroSectionData = await queries.getHeroData(region)

  return {
    props: {
      region,
      heroSectionData,
    },
  }
}
