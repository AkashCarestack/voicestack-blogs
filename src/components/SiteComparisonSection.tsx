import React, { useEffect, useState } from 'react'
import Section from './structure/Section'
import Container from './structure/Container'
import Button from './common/Button'
import { useRouter } from 'next/router'
import LegendSection from './common/LegendSection'
import ComparisonTable from './ComparisonTable'
import SectionHeader from './revamp/components/common/sectionHeader'
import SectionHeaderV2 from './revamp/components/common/sectionHeaderV2'

interface SiteComparisonSectionProps {
  data: any
  legendData?: any
  refer?: any
  variant?: 'V1' | 'V2'
}

function SiteComparisonSection({ data, legendData=null, refer=null, variant }: SiteComparisonSectionProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const [hideTable, setHideTable] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkWidth();

    window.addEventListener('resize', checkWidth);
    
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  
  return (
    hideTable ? (
      <></>
    ):(
      variant === 'V2' ? (
        <Section className='bg-[#ffffff]' border="b">
        <Container className='w-full py-sm md:py-md lg:py-lg' type="V2" border="y-0">
          <div className="flex-col relative w-full flex gap-16">
            <SectionHeaderV2 className='xl:px-12 md:px-6 px-4'
              heading={"Best phone system.<br> For the best dental practices."}
              description={"No other phone system can match VoiceStack’s AI-driven features,outcome-driven workflows and integration capabilities, as shown in the comparison chart below."}
            />

          <div className='flex flex-col items-center w-full mt-12'>
            <div className='w-full flex flex-col gap-2 '>
              <ComparisonTable
                variant={variant}
                data={{
                  columnDimensionName: data.columnDimensionName,
                  ...data.table,
                }}
                legendData={legendData}
                demoLink={null}
              />
            </div>
            {/* {isMobile ? <LegendSection/> :
              <div className="flex justify-end pt-6 w-full">
              <span className='text-[11px] md:text-sm text-gray-600'>*Data from 3rd Party Services.</span>
              </div>
            } */}
          </div>
          </div>
        </Container>
      </Section>
      ) : (
      <Section id="comparison" className="py-sm md:py-md lg:py-lg scroll-m-16 bg-[#F9F9F9]">
        <Container className="flex flex-col items-center gap-16">
          <SectionHeader
            heading={data?.strip}
            description={data.header}
          />
          
          <div className='flex flex-col gap-12 items-center w-full'>
            <div className='w-full flex flex-col gap-2 '>
              <ComparisonTable
                data={{
                  columnDimensionName: data.columnDimensionName,
                  ...data.table,
                }}
                legendData={legendData}
                demoLink={null}
              />
            </div>
            {/* {isMobile ? <LegendSection/> :
              <div className="flex justify-end pt-6 w-full">
              <span className='text-[11px] md:text-sm text-gray-600'>*Data from 3rd Party Services.</span>
              </div>
            } */}
          </div>
         
          <div className='flex gap-4 items-center'>
              <Button type="primary" link="/demo">
                <span className="">{`Book Free Demo`}</span>
              </Button>
             
            </div>
        </Container>
      </Section>
      )
    )

  )
}

export default SiteComparisonSection
