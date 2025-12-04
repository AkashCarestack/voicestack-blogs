import { GetStaticProps } from 'next'

import Button from '~/components/common/Button'
import SimpleHead from '~/components/common/SimpleHead'
import MailIcon from '~/components/icons/MailIcon'
import PhoneIcon from '~/components/icons/PhoneIcon'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import SectionHeader from '~/components/revamp/components/common/sectionHeader'
import Queries from '~/components/revamp/queries'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import { useLayoutData } from '~/providers/LayoutDataProvider'


export default function ContactPage({ pageData }) {
  const { contactData } = useLayoutData()
  return (
    <>
      {/* <div
        className="py-12"
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
                link={'tel://1-407-833-6436'}
              >
                <PhoneIcon />
                <span>(407) 833-6436</span>
              </Button>
            </div>
          </Container>
        </Section>
      </div> */}
      <SimpleHead data={pageData?.seo} />
      <HeroWrapper>
        {pageData['contact-hero']?.componentData && (
          <HeroSection
            page="contact"
            isCentered={true}
            data={pageData['contact-hero']?.componentData}
            showFullDescription={true}
            contactData={contactData}
          />
        )}
      </HeroWrapper>
    </>
  )
}
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const region = locale || 'en'
    const queries = new Queries('contact', region)
    const slug =
      region === 'en' ? 'contact' : `contact-${region.toLowerCase()}`

    // Fetch page data for integrations
    const pageData = await queries.getPageData('company', slug)

    if (!pageData || Object.keys(pageData).length === 0) {
      return {
        notFound: true,
      }
    }

   
    return {
      props: {
        pageData,
        region,
      },
    }
  } catch (error) {
    console.error('Error fetching integrations page data:', error)
    return {
      notFound: true,
    }
  }
}
