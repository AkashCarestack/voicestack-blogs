import React from 'react'
import Button from '~/components/common/Button'
import Container from '~/components/structure/Container'
import Image from 'next/image'
import Section from '~/components/structure/Section'
import SectionHeaderV2 from '~/v2/components/common/sectionHeaderV2'
import PillsBg from 'public/assets/pills-bg.png'

interface OfferSectionProps {
  data:any
}

const OfferSection = ({ data }: OfferSectionProps) => {

  return (
    <Section className='bg-gray-50 relative overflow-hidden' border="b">
      <Container className='py-16' type="V2" border='y-0'>
        <div className="flex relative" style={{ background: 'linear-gradient(258deg, #D3C6FB 0%, #393CC0 100%)' }}>
          <div className="flex relative z-10">
            <div className="max-w-[702px] md:p-16 p-12 flex-1">
              <div className="flex-col relative w-full flex gap-8">

                <SectionHeaderV2 isLeftAlign={true} className='' isWhite={true}
                  heading={data?.sectionHeadingDynamic}
                  // heading={pageData['how-voicestack-works2'].componentData.heading}
                  description={data?.subDescription}
                  
                />
                <div className="flex justify-start">
                  <Button
                    type="primary"
                    className="w-fit"
                    link="#demo"
                  >
                    <span>
                      {'Book Free Demo'}
                    </span>
                  </Button>
                </div>

              </div>
            </div>
            <div className="flex-1 self-end">
              <Image src={data.cardImage.url} alt='World Map' className="h-auto w-full object-cover"
                width={727}
                height={727}
              />
            </div>
          </div>
          <Image src={PillsBg} alt='Pills Background' className="absolute bottom-0 right-0 h-full w-auto hidden md:block"
            width={727}
            height={727}
          />
        </div>
      </Container>
    </Section>
  );
};

export default OfferSection;
