import React from 'react'
import Button from '~/components/common/Button'
import Container from '~/components/structure/Container'
import Image from 'next/image'
import Section from '~/components/structure/Section'
import SectionHeaderV2 from '~/v2/components/common/sectionHeaderV2'
import PillsBg from 'public/assets/pills-bg.png'

interface OfferSectionProps {
  data:any
  spacingY?: boolean
  variant? : 'default' | 'compact'
}

const OfferSection = ({ data, variant = 'default', spacingY=false }: OfferSectionProps) => {
  const compact = variant === 'compact';
  return (
    <Section className={`bg-white relative overflow-hidden`}>
      <Container className={`${spacingY ? 'py-16' : ''}`} type="V2" border='y-0'>
        <div className="flex relative" style={{ background: 'linear-gradient(258deg, #D3C6FB 0%, #393CC0 100%)' }}>
          <div className="flex md:flex-row flex-col relative z-10 w-full">
            <div className="max-w-[702px] md:p-16 py-8 px-8 flex-1">
              <div className="flex-col relative w-full flex gap-8">
                {/* {compact ?(
                  <></>
                ):( */}

                  <SectionHeaderV2 isLeftAlign={true} className='' isWhite={true}
                    heading={data?.sectionHeadingDynamic}
                    // heading={pageData['how-voicestack-works2'].componentData.heading}
                    description={data?.subDescription}
                    headingMd={compact ? true : false}
                    // demoButton={true}
                    
                  />
                {/* )} */}
                {data?.ctaListItems && data.ctaListItems.length > 0 && (
                  <div className="flex justify-start gap-4 flex-wrap">
                    {data.ctaListItems.map((cta: any, index: number) => (
                      <Button
                        key={index}
                        type={cta?.ctaType || 'primary'}
                        className="w-fit"
                        link={cta?.ctaLink || '#'}
                      >
                        <span>
                          {cta?.ctaText || 'Button'}
                        </span>
                      </Button>
                    ))}
                  </div>
                )}

              </div>
            </div>
            <div className="flex-1 self-end h-full">
              <Image src={data.cardImage.url} alt='World Map' className="h-full w-full object-cover object-right"
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
