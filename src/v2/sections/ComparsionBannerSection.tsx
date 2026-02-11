import React from 'react'
import Button from '~/components/common/Button'
import Container from '~/components/structure/Container'
import Image from 'next/image'
import Section from '~/components/structure/Section'
import SectionHeaderV2 from '~/v2/components/common/sectionHeaderV2'
import bannerBg from 'public/background/styledBgImage.png'

interface OfferSectionProps {
  data:any
  spacingY?: boolean
  variant? : 'default' | 'compact'
}

const ComparisonBannerSection = ({ data, variant = 'default', spacingY=false }: OfferSectionProps) => {

  return (
    <Section 
    className={`bg-white relative overflow-hidden`}>
      <Container className={`${spacingY ? 'py-16' : ''}`} type="V2" border='y-0'>
        <div className="flex relative bg-cover bg-center" style={{ backgroundImage: `url(${bannerBg.src})` }}>
          <div className="flex md:flex-row flex-col relative z-10 w-full">
            <div className=" md:p-16 md:py-8 md:px-8 py-4 px-4 flex-1">
              <div className="flex-col relative w-full flex gap-8 justify-center md:py-16 py-8 px-4  bg-white">
                {/* {compact ?(
                  <></>
                ):( */}

                  <SectionHeaderV2  className=''
                    heading={data?.sectionHeadingDynamic}
                    // heading={pageData['how-voicestack-works2'].componentData.heading}
                    description={data?.sectionDescriptionDynamic}
                    headingMd={true}
                    demoButton={true}
                    
                  />
                {/* )} */}
                {/* {data?.ctaListItems && data.ctaListItems.length > 0 && (
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
                )} */}

              </div>
            </div>

          </div>
       
        </div>
      </Container>
    </Section>
  );
};

export default ComparisonBannerSection;
